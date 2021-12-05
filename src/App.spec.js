import {fireEvent, render, waitFor} from '@testing-library/vue'
import App from './App'
import {repositoryName, searchPlaceholder} from "../stubs/constants";

describe('<App />', () => {
  test('Display input text when loading is false', () => {
    const { getByPlaceholderText } = render(App)
    expect(getByPlaceholderText(searchPlaceholder)).toBeTruthy();
  })

  test('Not display repo title if empty', async () => {
    const { queryByTestId } = render(App)
    expect(await queryByTestId('repo-title')).toBeFalsy()
  })

  test.skip('should fire just once when data is still loading', async () => {
    const fetchCalled = jest.spyOn(global, 'fetch')

    const { getByText, getByPlaceholderText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))
    await fireEvent.click(getByText('Load'))

    // 1 - barchart 2 - fetchStacks, 3 - fetch topics
    expect(fetchCalled).toHaveBeenCalledTimes(3)
  })

  describe('general information', () => {
    test('renders github repo name', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText(repositoryName)).toBeTruthy())
    })

    test('renders total of commits', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText(repositoryName)).toBeTruthy())
    })

    test('renders visualization options', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('Commits (30)')).toBeInTheDocument())
    })
  })

  describe('bubble chart', () => {
    test('renders tech stack title stats', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('Tech stack (in bytes - 0)')).toBeInTheDocument())
    })
  })

  describe('word cloud', () => {
    test('renders topics title', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('Topics (0)')).toBeInTheDocument())
    })
  })

})