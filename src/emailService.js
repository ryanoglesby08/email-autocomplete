const baseUrl = 'https://trunkclub-ui-takehome.now.sh'

export const sendEmail = async ({ to, cc, subject, body }) => {
  return await fetch(`${baseUrl}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      cc,
      subject,
      body,
    }),
  })
}
