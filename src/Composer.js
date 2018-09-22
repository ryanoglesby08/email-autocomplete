import React, { Component } from 'react'

import { sendEmail } from './emailService'

class Composer extends Component {
  state = {
    to: '',
    cc: '',
    subject: '',
    body: '',
  }

  submitDraft = () => {
    const { cc, ...rest } = this.state

    sendEmail({ ...rest, cc: cc.split(',') })
  }

  render() {
    const { to, cc, subject, body } = this.state

    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          this.submitDraft()
        }}
      >
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
