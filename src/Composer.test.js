import React from 'react'
import { render, fireEvent } from 'react-testing-library'

import Composer from './Composer'

import { sendEmail } from './emailService'

jest.mock('./emailService', () => {
  return {
    sendEmail: jest.fn(),
  }
})

const enterText = (element, value) => {
  fireEvent.change(element, { target: { value } })
}

it('submits an email', () => {
  const { getByLabelText, getByText } = render(<Composer />)

  enterText(getByLabelText('To'), 'you@email.com')
  enterText(getByLabelText('Cc'), 'someone@email.com')
  enterText(getByLabelText('Subject'), 'This is a test')
  enterText(getByLabelText('Body'), "I'm emailing you from a test")

  fireEvent.click(getByText('Send'))

  expect(sendEmail).toHaveBeenCalledWith({
    to: 'you@email.com',
    cc: ['someone@email.com'],
    subject: 'This is a test',
    body: "I'm emailing you from a test",
  })
})
