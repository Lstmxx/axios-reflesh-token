# axios-refresh-token
封装axios，支持刷新token

install:
```
npm install @lstmxx/axios-refresh-token --save
```

example:

```js
import Service from '@lstmxx/axios-refresh-token'
const options = {
  config: {
    baseURL: '',
    timeout: 6000
  },
  requestInterceptors: function (config, getToken) {
    // reqeust TODO
    return config
  },
  responseInterceptors: function (response) {
    // response TODO
    return response
  },
  // diposed refresh token interface url , method and data
  refreshTokenConfig: {
    url: '',
    method: '',
    data: {
    }
  },
  // use setToken to save token in SessionStorage
  refreshTokenFn: function (response, setToken) {
    if (response.data.code === 200) {
      setToken(token, 'tokenName')
      return true
    }
    return false
  }
}
const service = new Service(options)

```