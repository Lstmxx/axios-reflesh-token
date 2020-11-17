const TOKEN_KEY = 'token'
const storage = window.sessionStorage
export const setToken = (token, type) => {
  storage.setItem(TOKEN_KEY, token)
  storage.setItem('type', type)
}

export const getToken = () => {
  const token = storage.getItem(TOKEN_KEY)
  if (token) return token
  else return false
}

export const getType = () => {
  const type = storage.getItem('type')
  return type
}
