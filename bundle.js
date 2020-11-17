'use strict';

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

const TOKEN_KEY = 'token';
const storage = window.sessionStorage;
const setToken = (token, type) => {
  storage.setItem(TOKEN_KEY, token);
  storage.setItem('type', type);
};

const getToken = () => {
  const token = storage.getItem(TOKEN_KEY);
  if (token) return token
  else return false
};

function isObject (obj) {
  return typeof obj === 'object'
}

function forEach (obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return
  }
  if (typeof obj !== 'object') {
    obj = [obj];
  }
  if (Array.isArray(obj)) {
    for (let index = 0; index < obj.length; index++) {
      fn(obj[index], index, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn(obj[key], key, obj);
      }
    }
  }
}

function isFunction (_function) {
  return typeof _function === 'function'
}

function merge () {
  const result = {};
  function assignValue (val, key) {
    if (isObject(result[key]) && isObject(val)) {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }
  for (let index = 0, l = arguments.length; index < l; index++) {
    forEach(arguments[index], assignValue);
  }
  return result
}

const baseConfig = {
  baseUrl: '',
  timeout: 6000,
  responseType: 'application/json',
  withCredentials: true,
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  transformRequest: [function (data) {
    data = JSON.stringify(data);
    return data
  }],
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    if (typeof data === 'string' && data.startsWith('{')) {
      data = JSON.parse(data);
    }
    return data
  }]
};
function initAxios (config) {
  const _config = merge(baseConfig, config);
  const _axios = axios__default['default'].create(_config);
  return _axios
}

const Service = function Service (options) {
  this.isReflash = false;
  this.reTryReqeustList = [];
  const config = options.config ? options.config : {};
  const responseInterceptors = options.responseInterceptors;
  const requestInterceptors = options.requestInterceptors;
  const reflashTokenConfig = options.reflashTokenConfig || null;
  const getTokenFn = options.getTokenFn;
  const axios = initAxios(config);
  function _reflashToken () {
    return new Promise((resolve, reject) => {
      axios.request(reflashTokenConfig).then((response) => {
        const isResolve = getTokenFn(response, setToken);
        if (isResolve) resolve();
        else reject(new Error('get token error'));
      }).catch((err) => {
        reject(err);
      });
    })
  }
  axios.interceptors.request.use((_config) => {
    const c = isFunction(requestInterceptors) ? requestInterceptors(_config, getToken) : _config;
    if (this.isReflash) {
      console.log('hleo');
    }
    return c
  }, (error) => {
    error.data = {};
    error.data.msg = '服务器异常，请联系管理员！';
    return Promise.resolve(error)
  });
  axios.interceptors.response.use((response) => {
    if (isFunction(responseInterceptors)) {
      return responseInterceptors(response)
    }
    return response
  }, async (error) => {
    if (error.response && error.response.status === 401) {
      if (!this.isReflash) {
        this.isReflash = true;
        try {
          reflashTokenConfig && await _reflashToken();
          this.isReflash = false;
          while (this.reTryReqeustList.length > 0) {
            const cb = this.reTryReqeustList.shift();
            cb();
          }
          return axios.request(error.response.config)
        } catch (err) {
          return Promise.reject(err)
        }
      } else {
        return new Promise((resolve) => {
          this.reTryReqeustList.push(
            () => resolve(axios.request(error.response.config))
          );
        })
      }
    }
    return Promise.reject(error)
  });
  this.axios = axios;
};

Service.prototype.request = function request (options) {
  return this.axios.request(options)
};

module.exports = Service;
