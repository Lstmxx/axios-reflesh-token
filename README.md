# axios-reflesh-token
封装axios，支持刷新token

install:
```
npm install @lstmxx/axios-reflesh-token --save
```

example:

```js
const options = {
  config: {
    baseURL: '',
    timeout: 6000
  },
  requestInterceptors: function (config, getToken) {
    config.headers.Authorization = 'Bearer ' + getToken()
    return config
  },
  responseInterceptors: function (response) {
    const data = response.data
    const res = {
      status: data.code || response.status,
      data,
      msg: ''
    }
    res.msg = data.message || showStatus(res.status)
    return res
  },
  reflashTokenConfig: {
    url: '',
    method: '',
    data: {
    }
  },
  getTokenFn: function (response, setToken) {
    if (response.data.code === 200) {
      setToken(response.data.data.token, response.data.data.tokenType)
      return true
    }
    return false
  }
}
const service = new Service(options)

```