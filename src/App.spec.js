import {fireEvent, render, waitFor} from '@testing-library/vue'
import App from './App'

describe('<App />', () => {
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

    test('renders visualization options', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable'), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('Repo activity by')).toBeInTheDocument())
    })

    test.each([
      'day',
      'week',
      'month',
      'year',
    ])('renders commits by %', async (option) => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable'), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText(option)).toBeInTheDocument())
    })

    test('by default month should be selected', async () => {
      const { getByText, getByPlaceholderText, queryByTestId } = render(App)

      await fireEvent.update(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable'), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByTestId('month')).toBeChecked())
    })

    test.each([
      'day',
      'week',
      'year',
    ])('by default %s should not be selected', async (option) => {
      const { getByText, getByPlaceholderText, queryByTestId } = render(App)

      await fireEvent.update(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable'), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByTestId(option)).not.toBeChecked())
    })
  })

  describe('barchart data', () => {
    test('renders number of commits by month (YYYY-MM): 2019-09', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable'), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('2019-09')).toBeInTheDocument())
    })

    test.each([
      '2019-09-07',
      '2019-09-09',
      '2019-09-14',
      '2019-09-15',
      '2019-09-17',
      '2019-09-18',
    ])('renders number of commits by day (YYYY-MM-DD): %s', async (day) => {
      const { getByText, getByPlaceholderText, queryByText, getByTestId, queryByTestId } = render(App)

      await fireEvent.update(getByPlaceholderText('Github Repo - :owner/:repo eg: marabesi/testable'), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(() => expect(queryByTestId('day')).toBeInTheDocument())

      await fireEvent.click(getByTestId('day'))

      await waitFor(()=> expect(queryByText(day)).toBeInTheDocument())
    })
  })
})