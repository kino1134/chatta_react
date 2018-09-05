const apiCall = async ({ url, method, body }) =>
  fetch(url, { method, body, headers: { 'content-type': 'application/json' } })

export default {
  post: async (url, body) => apiCall({ method: 'POST', url, body })
}
