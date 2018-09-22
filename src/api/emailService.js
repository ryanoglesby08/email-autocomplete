import fetch from './fetch'
import ApiError from './ApiError'

const baseUrl = 'https://trunkclub-ui-takehome.now.sh'

const post = async (url, body) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const sendEmail = async ({ to, cc, subject, body }) => {
  const response = await post(`${baseUrl}/submit`, {
    to,
    cc,
    subject,
    body,
  })

  if (response.ok) {
    return response.json()
  }

  const json = await response.json()
  if (response.status >= 400 && response.status < 499) {
    throw new ApiError('CLIENT_ERROR', json.message)
  }
  if (response.status >= 500 && response.status < 599) {
    throw new ApiError('SERVER_ERROR', json.message)
  }
}
