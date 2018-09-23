import React, { Component, Fragment } from 'react'

import { searchByName } from './api/emailService'

import './Autocomplete.css'

class Autocomplete extends Component {
  searchResultElements = []

  state = {
    chosenValues: [],
    searchResults: undefined,
  }

  search = async value => {
    const searchName = value.split(' ').slice(-1)[0]

    if (searchName && !this.state.chosenValues.includes(searchName)) {
      const searchResults = await searchByName(searchName)

      this.searchResultElements = []
      this.setState({ searchResults })
    }
  }

  chooseValue = email => {
    const { onChange } = this.props
    const { chosenValues } = this.state

    const newValue = chosenValues.concat(email).join(', ')

    onChange(newValue)
    this.searchResultElements = []
    this.setState(prevState => {
      return {
        ...prevState,
        chosenValues: prevState.chosenValues.concat(email),
        searchResults: undefined,
      }
    })
  }

  navigateToSearchResults = e => {
    if (e.key === 'ArrowDown') {
      const navigateTo = this.searchResultElements[0]
      navigateTo && navigateTo.focus()
    }
  }

  navigateWithinSearchResults = (e, index) => {
    let navigateTo
    if (e.key === 'ArrowDown') {
      navigateTo = this.searchResultElements[index + 1]
    } else if (e.key === 'ArrowUp') {
      navigateTo = this.searchResultElements[index - 1] || this.input
    }

    navigateTo && navigateTo.focus()
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
          ref={element => (this.input = element)}
          onChange={e => {
            this.search(e.target.value)
            onChange(e.target.value)
          }}
          onKeyDown={this.navigateToSearchResults}
        />
        {searchResults && (
          <ul className="Autocomplete-searchResultList">
            {searchResults.map(({ id, firstName, lastName, email }, index) => (
              <li key={id}>
                <button
                  className="Autocomplete-searchResult"
                  ref={element => (this.searchResultElements[index] = element)}
                  onClick={() => this.chooseValue(email)}
                  onKeyDown={e => this.navigateWithinSearchResults(e, index)}
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
