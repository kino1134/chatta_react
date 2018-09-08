import decode from 'jwt-decode'

const ACCESS_TOKEN = 'access_token'

export const setAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN, token)

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN)

export const clearAccessToken = () =>
  localStorage.removeItem(ACCESS_TOKEN)

export const loggedIn = () => {
  const token = getAccessToken()
  return !!token && !isTokenExpired(token)
}

const getTokenExpirationDate = (token) => {
  let claim
  try {
    claim = decode(token)
  } catch (err) { return null }
  if (!claim.exp) return null

  const date = new Date(0)
  date.setUTCSeconds(claim.exp)
  return date
}

const isTokenExpired = (token) => {
  const expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}
