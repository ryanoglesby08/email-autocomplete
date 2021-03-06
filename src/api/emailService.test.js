import fetch from './fetch'
import ApiError from './ApiError'

import { sendEmail } from './emailService'

jest.mock('./fetch', () => jest.fn())

describe('sendEmail', () => {
  it('gives back JSON on success', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => {
          return Promise.resolve({ message: 'success' })
        },
      }),
    )
    const response = await sendEmail({
      to: 'you@email.com',
      cc: 'someone@email.com, else@email.com',
      subject: 'the subject',
      body: 'the body',
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          to: 'you@email.com',
          cc: ['someone@email.com', 'else@email.com'],
          subject: 'the subject',
          body: 'the body',
        }),
      }),
    )

    expect(response).toEqual({ message: 'success' })
  })

  it('throws a client error', async done => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => {
          return Promise.resolve({
            statusCode: 400,
            message: 'some client error',
          })
        },
      }),
    )

    try {
      await sendEmail({
        to: 'you@email.com',
        cc: 'someone@email.com, else@email.com',
        subject: 'the subject',
        body: 'the body',
      })
    } catch (e) {
      expect(e).toEqual(new ApiError('CLIENT_ERROR', 'some client error'))
      done()
    }
  })

  it('throws a server error', async done => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => {
          return Promise.resolve({
            statusCode: 500,
            message: 'some server error',
          })
        },
      }),
    )

    try {
      await sendEmail({
        to: 'you@email.com',
        cc: 'someone@email.com, else@email.com',
        subject: 'the subject',
        body: 'the body',
      })
    } catch (e) {
      expect(e).toEqual(new ApiError('SERVER_ERROR', 'some server error'))
      done()
    }
  })
})
