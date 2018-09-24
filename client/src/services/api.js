import download from 'downloadjs'
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

const json = async ({ url, method, body }) => {
  try {
    const res = await apiCall({ url, method, body })
    const json = await res.json()
    res.data = json
    return res
  } catch (err) {
    throw err
  }
}

export default {
  post: async (url, body) =>
    apiCall({ method: 'POST', url, body: JSON.stringify(body) }),
  get: async (url) =>
    apiCall({ method: 'GET', url }),
  put: async (url, body) =>
    apiCall({ method: 'PUT', url, body: JSON.stringify(body) }),
  delete: async (url, body) =>
    apiCall({ method: 'DELETE', url, body: JSON.stringify(body) }),

  postJson: async (url, body) =>
    json({ method: 'POST', url, body: JSON.stringify(body) }),
  getJson: async (url) =>
    json({ method: 'GET', url }),
  putJson: async (url, body) =>
    json({ method: 'PUT', url, body: JSON.stringify(body) }),
  deleteJson: async (url, body) =>
    json({ method: 'DELETE', url, body: JSON.stringify(body) }),

  postData: async ({ url, body }) => {
    const headers = {}
    const token = getAccessToken()
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return fetch(config.api.uri + url, { method: 'POST', body, headers })
  },
  downloadFile: async (url, name) => {
    try {
      const res = await apiCall({ method: 'GET', url })
      const data = await res.blob()
      download(data, name)
      res.data = data
      return res
    } catch (err) {
      throw err
    }
  }
}
