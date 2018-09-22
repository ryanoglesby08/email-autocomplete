import { fireEvent } from 'react-testing-library'

export default (element, value) => {
  fireEvent.change(element, { target: { value } })
}
