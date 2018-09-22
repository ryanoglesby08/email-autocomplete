import React, { Component } from 'react'

import { searchByName } from './api/emailService'

class Autocomplete extends Component {
  state = {
    searchResults: undefined,
  }

  search = async searchName => {
    const searchResults = await searchByName(searchName)

    this.setState({ searchResults })
  }

  chooseEmail = email => {
    const { onChange } = this.props

    onChange(email)
    this.setState({ searchResults: undefined })
  }

  render() {
    const { searchResults } = this.state
    const { value, onChange, ...rest } = this.props

    return (
      <div>
        <input
          {...rest}
          type="text"
          value={value}
          onChange={e => {
            this.search(e.target.value)
            onChange(e.target.value)
          }}
        />
        {searchResults && (
          <ul>
            {searchResults.map(({ id, firstName, lastName, email }) => (
              <li key={id}>
                <button
                  onClick={() => this.chooseEmail(email)}
                >{`${firstName} ${lastName} <${email}>`}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default Autocomplete
