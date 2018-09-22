import React, { Component } from 'react'

import { render, waitForElement, fireEvent } from 'react-testing-library'

import enterText from './__test-utils__/enterText'

import { searchByName } from './api/emailService'
import Autocomplete from './Autocomplete'

jest.mock('./api/emailService', () => {
  return {
    searchByName: jest.fn(),
  }
})

class AutocompleteParent extends Component {
  state = {
    value: '',
  }

  render() {
    const { value } = this.state

    return (
      <Autocomplete
        value={value}
        onChange={value => this.setState({ value })}
      />
    )
  }
}

it('selects an email from the search results', async () => {
  searchByName.mockImplementation(() =>
    Promise.resolve([
      {
        id: '1',
        firstName: 'Aaron',
        lastName: 'Swartz',
        email: 'aaron@email.com',
      },
      {
        id: '2',
        firstName: 'Iggy',
        lastName: 'Azalea',
        email: 'azalea@email.com',
      },
    ]),
  )

  const { container, getByText } = render(<AutocompleteParent />)

  enterText(container.querySelector('input'), 'a')

  await waitForElement(() => getByText('Aaron Swartz <aaron@email.com>'))
  fireEvent.click(getByText('Iggy Azalea <azalea@email.com>'))

  expect(container.querySelector('input')).toHaveAttribute(
    'value',
    'azalea@email.com',
  )
  expect(document.querySelector('ul')).not.toBeInTheDocument()
})
