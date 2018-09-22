import React, { Component, Fragment } from 'react'

import { sendEmail } from './api/emailService'
import Autocomplete from './Autocomplete'

class Composer extends Component {
  state = {
    to: '',
    cc: '',
    subject: '',
    body: '',
  }

  reset = () => {
    this.setState({
      to: '',
      cc: '',
      subject: '',
      body: '',
    })
  }

  render() {
    return (
      <SendEmail onSuccess={this.reset}>
        {({ submitDraft, feedbackMessage }) => {
          return (
            <ComposerForm
              to={this.state.to}
              cc={this.state.cc}
              subject={this.state.subject}
              body={this.state.body}
              feedbackMessage={feedbackMessage}
              onSubmit={submitDraft}
              onFieldChange={(field, value) =>
                this.setState({ [field]: value })
              }
            />
          )
        }}
      </SendEmail>
    )
  }
}

const FeedbackMessage = ({ success, error }) => {
  if (success) {
    return <div>🎉 Email sent successfully!</div>
  } else {
    if (error.kind === 'CLIENT_ERROR') {
      return (
        <Fragment>
          <div>
            🤔 Oops, looks like you made a mistake. Please correct any errors
            and try again.
          </div>
          <div>{error.message}</div>
        </Fragment>
      )
    } else {
      return (
        <div>🤭 Sorry about this, we screwed up. Will you try that again?</div>
      )
    }
  }
}

class SendEmail extends Component {
  state = {
    done: false,
    success: undefined,
    error: undefined,
  }

  submitDraft = async ({ to, cc, subject, body }) => {
    const { onSuccess } = this.props

    try {
      await sendEmail({ to, cc, subject, body })

      onSuccess()
      this.setState({
        done: true,
        success: true,
      })
    } catch (error) {
      this.setState({ done: true, success: false, error })
    }
  }

  render() {
    const { children } = this.props
    const { done, success, error } = this.state

    return children({
      submitDraft: this.submitDraft,
      feedbackMessage: done && (
        <FeedbackMessage success={success} error={error} />
      ),
    })
  }
}

const ComposerForm = ({
  to,
  cc,
  subject,
  body,
  onSubmit,
  onFieldChange,
  feedbackMessage,
}) => (
  <form
    onSubmit={e => {
      e.preventDefault()
      onSubmit({ to, cc, subject, body })
    }}
  >
    {feedbackMessage}

    <div>
      <label htmlFor="to">To</label>
      <Autocomplete
        id="to"
        value={to}
        onChange={value => onFieldChange('to', value)}
      />
    </div>

    <div>
      <label htmlFor="cc">Cc</label>
      <Autocomplete
        id="cc"
        value={cc}
        onChange={value => onFieldChange('cc', value)}
      />
    </div>

    <div>
      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        type="text"
        value={subject}
        onChange={e => onFieldChange('subject', e.target.value)}
      />
    </div>

    <div>
      <label htmlFor="body">Body</label>
      <textarea
        id="body"
        value={body}
        onChange={e => onFieldChange('body', e.target.value)}
      />
    </div>

    <button type="submit">Send</button>
  </form>
)

export default Composer
