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

it('selects a single email from the search results', async () => {
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

it('selects multiple emails over multiple searches', async () => {
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

  expect(searchByName).toHaveBeenCalledWith('a')

  const aaron = await waitForElement(() =>
    getByText('Aaron Swartz <aaron@email.com>'),
  )
  fireEvent.click(aaron)

  expect(container.querySelector('input')).toHaveAttribute(
    'value',
    'aaron@email.com',
  )

  enterText(container.querySelector('input'), 'aaron@email.com az')

  expect(searchByName).toHaveBeenCalledWith('az')

  const iggy = await waitForElement(() =>
    getByText('Iggy Azalea <azalea@email.com>'),
  )
  fireEvent.click(iggy)

  expect(container.querySelector('input')).toHaveAttribute(
    'value',
    'aaron@email.com, azalea@email.com',
  )
})

it('navigates the search results with the arrow keys', async () => {
  const downArrow = { keyCode: 40 }
  const upArrow = { keyCode: 38 }

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

  const aaron = await waitForElement(() =>
    getByText('Aaron Swartz <aaron@email.com>'),
  )
  const iggy = getByText('Iggy Azalea <azalea@email.com>')

  fireEvent.keyDown(container.querySelector('input'), downArrow)
  expect(aaron).toHaveFocus()

  fireEvent.keyDown(aaron, downArrow)
  expect(iggy).toHaveFocus()

  fireEvent.keyDown(iggy, downArrow)
  expect(iggy).toHaveFocus()

  fireEvent.keyDown(iggy, upArrow)
  expect(aaron).toHaveFocus()

  fireEvent.keyDown(aaron, upArrow)
  expect(container.querySelector('input')).toHaveFocus()
})
