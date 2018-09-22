import React, { Component, Fragment } from 'react'

import { searchByName } from './api/emailService'

import './Autocomplete.css'

class Autocomplete extends Component {
  state = {
    chosenValues: [],
    searchResults: undefined,
  }

  search = async value => {
    const searchName = value.split(' ').slice(-1)[0]

    if (searchName && !this.state.chosenValues.includes(searchName)) {
      const searchResults = await searchByName(searchName)
      this.setState({ searchResults })
    }
  }

  chooseValue = email => {
    const { onChange } = this.props
    const { chosenValues } = this.state

    const newValue = chosenValues.concat(email).join(', ')

    onChange(newValue)
    this.setState(prevState => {
      return {
        ...prevState,
        chosenValues: prevState.chosenValues.concat(email),
        searchResults: undefined,
      }
    })
  }

  render() {
    const { searchResults } = this.state
    const { value, onChange, ...rest } = this.props

    return (
      <Fragment>
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
          <ul className="Autocomplete-searchResultList">
            {searchResults.map(({ id, firstName, lastName, email }) => (
              <li key={id}>
                <button
                  className="Autocomplete-searchResult"
                  onClick={() => this.chooseValue(email)}
                >{`${firstName} ${lastName} <${email}>`}</button>
              </li>
            ))}
          </ul>
        )}
      </Fragment>
    )
  }
}

export default Autocomplete
