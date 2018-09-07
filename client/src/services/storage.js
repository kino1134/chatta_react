const ACCESS_TOKEN = 'access_token'

export const setAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN, token)

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN)

export const clearAccessToken = () =>
  localStorage.removeItem(ACCESS_TOKEN)
