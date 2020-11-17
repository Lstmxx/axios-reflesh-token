import axios from 'axios'
import { merge } from '../util/util'
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
    data = JSON.stringify(data)
    return data
  }],
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    if (typeof data === 'string' && data.startsWith('{')) {
      data = JSON.parse(data)
    }
    return data
  }]
}
export function initAxios (config) {
  const _config = merge(baseConfig, config)
  const _axios = axios.create(_config)
  return _axios
}
