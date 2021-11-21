import {fireEvent, render, waitFor} from '@testing-library/vue'
import App from './App'

describe('<App />', done => {

  test('Display input text when loading is false', () => {
    const { getByPlaceholderText } = render(App)
    expect(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable')).toBeTruthy();
  })

  test('Not display repo title if empty', async () => {
    const { queryByTestId } = render(App)
    expect(await queryByTestId('repo-title')).toBeFalsy()
  })

  describe('general information', () => {
    test('renders github repo name', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable'), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('marabesi/testable')).toBeTruthy())
    })
  })
})