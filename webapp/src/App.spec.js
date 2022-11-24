import {fireEvent, render, waitFor} from '@testing-library/vue'
import App from './App'
import {repositoryName, searchPlaceholder} from "../stubs/constants";
import fakeGithubLanguages from "../stubs/github.languages.json"

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

  describe('Tech stack', () => {
    beforeEach(() => {
      fetchMock.mockOnceIf(/languages/, JSON.stringify(fakeGithubLanguages))
    })

    test('should render html in the tech stack', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('HTML: 1729')).toBeInTheDocument())
    })
  });
})