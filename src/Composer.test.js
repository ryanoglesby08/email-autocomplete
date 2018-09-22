import React from 'react'
import { render, fireEvent, waitForElement } from 'react-testing-library'

import enterText from './__test-utils__/enterText'

import ApiError from './api/ApiError'
import { sendEmail } from './api/emailService'

import Composer from './Composer'

jest.mock('./api/emailService', () => {
  return {
    searchByName: jest.fn(),
    sendEmail: jest.fn(),
  }
})

const draftTheEmail = getByLabelText => {
  const to = 'aaron@email.com'
  const cc = 'someone@email.com'
  const subject = 'This is a test'
  const body = "I'm emailing you from a test"

  enterText(getByLabelText('To'), to)
  enterText(getByLabelText('Cc'), cc)
  enterText(getByLabelText('Subject'), subject)
  enterText(getByLabelText('Body'), body)

  return { to, cc, subject, body }
}

const expectTheDraftToBe = (getByLabelText, { to, cc, subject, body }) => {
  expect(getByLabelText('To')).toHaveAttribute('value', to)
  expect(getByLabelText('Cc')).toHaveAttribute('value', cc)
  expect(getByLabelText('Subject')).toHaveAttribute('value', subject)
  expect(getByLabelText('Body')).toHaveTextContent(body)
}

const doRender = () => {
  const reactTestingLibraryFunctions = render(<Composer />)

  const { getByLabelText, getByText } = reactTestingLibraryFunctions

  return {
    draftTheEmail: () => draftTheEmail(getByLabelText),
    sendTheEmail: () => fireEvent.click(getByText('Send')),
    expectTheDraftToBe: values => expectTheDraftToBe(getByLabelText, values),
    expectTheDraftToBeBlank: () =>
      expectTheDraftToBe(getByLabelText, {
        to: '',
        cc: '',
        subject: '',
        body: '',
      }),
    ...reactTestingLibraryFunctions,
  }
}

it('submits an email', async () => {
  const { draftTheEmail, sendTheEmail } = doRender()

  const { to, cc, subject, body } = draftTheEmail()
  sendTheEmail()

  expect(sendEmail).toHaveBeenCalledWith({
    to,
    cc,
    subject,
    body,
  })
})

describe('giving feedback to the user after sending', () => {
  it('clears and shows a message upon success', async () => {
    sendEmail.mockImplementation(() => Promise.resolve())

    const {
      draftTheEmail,
      sendTheEmail,
      expectTheDraftToBeBlank,
      getByText,
    } = doRender()

    draftTheEmail()
    sendTheEmail()

    await waitForElement(() => getByText('🎉 Email sent successfully!'))
    expectTheDraftToBeBlank()
  })

  it('gives the user instructions to correct mistakes when there is a client error', async () => {
    sendEmail.mockImplementation(() => {
      throw new ApiError('CLIENT_ERROR', 'You made these mistakes...')
    })

    const {
      draftTheEmail,
      sendTheEmail,
      expectTheDraftToBe,
      getByText,
      container,
    } = doRender()

    const { to, cc, subject, body } = draftTheEmail()
    sendTheEmail()

    await waitForElement(() =>
      getByText(
        '🤔 Oops, looks like you made a mistake. Please correct any errors and try again.',
      ),
    )
    expectTheDraftToBe({ to, cc, subject, body })
    expect(container).toHaveTextContent('You made these mistakes...')
  })

  it('tells the user to just try again when there is a server problem', async () => {
    sendEmail.mockImplementation(() => {
      throw new ApiError('SERVER_ERROR', 'You made a mistake')
    })

    const {
      draftTheEmail,
      sendTheEmail,
      expectTheDraftToBe,
      getByText,
    } = doRender()

    const { to, cc, subject, body } = draftTheEmail()
    sendTheEmail()

    await waitForElement(() =>
      getByText('🤭 Sorry about this, we screwed up. Will you try that again?'),
    )
    expectTheDraftToBe({ to, cc, subject, body })
  })
})
