import React, { Component, Fragment } from 'react'

import { sendEmail } from './api/emailService'

class Composer extends Component {
  state = {
    emailSent: false,
    errorMessage: undefined,
    clientError: false,
    serverError: false,
    to: '',
    cc: '',
    subject: '',
    body: '',
  }

  submitDraft = async () => {
    const { to, cc, subject, body } = this.state

    try {
      await sendEmail({ to, cc: cc.split(','), subject, body })

      this.setState({
        emailSent: true,
        to: '',
        cc: '',
        subject: '',
        body: '',
      })
    } catch ({ kind, message }) {
      if (kind === 'CLIENT_ERROR') {
        this.setState({ clientError: true, errorMessage: message })
      }
      if (kind === 'SERVER_ERROR') {
        this.setState({ serverError: true })
      }
    }
  }

  render() {
    const {
      emailSent,
      clientError,
      serverError,
      errorMessage,
      to,
      cc,
      subject,
      body,
    } = this.state

    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          this.submitDraft()
        }}
      >
        {emailSent && <div>🎉 Email sent successfully!</div>}
        {serverError && (
          <div>
            🤭 Sorry about this, we screwed up. Will you try that again?
          </div>
        )}
        {clientError && (
          <Fragment>
            <div>
              🤔 Oops, looks like you made a mistake. Please correct any errors
              and try again.
            </div>
            <div>{errorMessage}</div>
          </Fragment>
        )}

        <div>
          <label htmlFor="to">To</label>
          <input
            id="to"
            type="text"
            value={to}
            onChange={e => this.setState({ to: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="cc">Cc</label>
          <input
            id="cc"
            type="text"
            value={cc}
            onChange={e => this.setState({ cc: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={e => this.setState({ subject: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={e => this.setState({ body: e.target.value })}
          />
        </div>

        <button type="submit">Send</button>
      </form>
    )
  }
}

export default Composer
