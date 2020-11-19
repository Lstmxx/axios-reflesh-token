import { setToken, getToken } from './util/tokenHelp'
import { isFunction } from './util/util'
import { initAxios } from './core/axios'

const Service = function Service (options) {
  this.isRefresh = false
  this.reTryReqeustList = []
  const config = options.config ? options.config : {}
  const responseInterceptors = options.responseInterceptors
  const requestInterceptors = options.requestInterceptors
  const refreshTokenConfig = options.refreshTokenConfig || null
  const refreshTokenFn = options.refreshTokenFn
  const axios = initAxios(config)
  function _refreshToken () {
    return new Promise((resolve, reject) => {
      axios.request(refreshTokenConfig).then((response) => {
        const isResolve = refreshTokenFn(response, setToken)
        if (isResolve) resolve()
        else reject(new Error('get token error'))
      }).catch((err) => {
        reject(err)
      })
    })
  }
  axios.interceptors.request.use((_config) => {
    const c = isFunction(requestInterceptors) ? requestInterceptors(_config, getToken) : _config
    if (this.isRefresh) {
      console.log('hleo')
    }
    return c
  }, (error) => {
    error.data = {}
    error.data.msg = '服务器异常，请联系管理员！'
    return Promise.resolve(error)
  })
  axios.interceptors.response.use((response) => {
    if (isFunction(responseInterceptors)) {
      return responseInterceptors(response)
    }
    return response
  }, async (error) => {
    if (error.response && error.response.status === 401) {
      if (!this.isRefresh) {
        this.isRefresh = true
        try {
          refreshTokenConfig && await _refreshToken()
          this.isRefresh = false
          while (this.reTryReqeustList.length > 0) {
            const cb = this.reTryReqeustList.shift()
            cb()
          }
          return axios.request(error.response.config)
        } catch (err) {
          return Promise.reject(err)
        }
      } else {
        return new Promise((resolve) => {
          this.reTryReqeustList.push(
            () => resolve(axios.request(error.response.config))
          )
        })
      }
    }
    return Promise.reject(error)
  })
  this.axios = axios
}

Service.prototype.request = function request (options) {
  return this.axios.request(options)
}

export default Service
