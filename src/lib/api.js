import { PUBLIC_API_URL } from '$env/static/public'

export const client = async (endpoint, { body, ...customConfig } = {}) => {
  const headers = { 'content-type': 'application/json' }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    }
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${PUBLIC_API_URL}${endpoint}`, config)

  if (response.ok) {
    // 200-299
    return await response.json()
  } else {
    return Promise.reject(new Error(await response.text()))
  }
}

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}
