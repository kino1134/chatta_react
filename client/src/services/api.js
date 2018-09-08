import { getAccessToken } from './storage'
import config from '../constants'

const apiCall = async ({ url, method, body }) => {
  const headers = { 'content-type': 'application/json' }
  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = 'Bearer ' + token
  }
  return fetch(config.api.uri + url, { method, body, headers })
}

export default {
  post: async (url, body) =>
    apiCall({ method: 'POST', url, body: JSON.stringify(body) }),
  get: async (url) =>
    apiCall({ method: 'GET', url })
}
