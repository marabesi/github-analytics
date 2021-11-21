import {fireEvent, render, waitFor} from '@testing-library/vue'
import App from './App'

const searchPlaceholder = 'Github Repo - :owner/:repo eg: marabesi/testable'

describe('<App />', () => {
  test('Display input text when loading is false', () => {
    const { getByPlaceholderText } = render(App)
    expect(getByPlaceholderText(searchPlaceholder)).toBeTruthy();
  })

  test('Not display repo title if empty', async () => {
    const { queryByTestId } = render(App)
    expect(await queryByTestId('repo-title')).toBeFalsy()
  })

  test('should fire just once when data is still loading', async () => {
    const fetchCalled = jest.spyOn(global, 'fetch')

    const { getByText, getByPlaceholderText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

    await fireEvent.click(getByText('Load'))
    await fireEvent.click(getByText('Load'))

    // 1 - barchart 2 - fetchStacks, 3 - fetch topics
    expect(fetchCalled).toHaveBeenCalledTimes(3)
  })

  describe('general information', () => {
    test('renders github repo name', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('marabesi/testable')).toBeTruthy())
    })

    test('renders visualization options', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText('Repo activity by')).toBeInTheDocument())
    })

    test.each([
      'day',
      'week',
      'month',
      'year',
    ])('renders commits by %s', async (option) => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByText(option)).toBeInTheDocument())
    })

    test('by default month should be selected', async () => {
      const { getByText, getByPlaceholderText, queryByTestId } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByTestId('month')).toBeChecked())
    })

    test.each([
      'day',
      'week',
      'year',
    ])('by default %s should not be selected', async (option) => {
      const { getByText, getByPlaceholderText, queryByTestId } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(()=> expect(queryByTestId(option)).not.toBeChecked())
    })
  })

  describe('barchart data', () => {
    test('renders number of commits by year (YYYY): 2019', async () => {
      const { getByText, getByPlaceholderText, queryByText, queryByTestId, getByTestId } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(() => expect(queryByTestId('year')).toBeInTheDocument())

      await fireEvent.click(getByTestId('year'))

      await waitFor(()=> expect(queryByText('2019')).toBeInTheDocument())
    })

    test('renders number of commits by month (YYYY-MM): 2019-09', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

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

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(() => expect(queryByTestId('day')).toBeInTheDocument())

      await fireEvent.click(getByTestId('day'))

      await waitFor(()=> expect(queryByText(day)).toBeInTheDocument())
    })

    test.each([
      '2019-36',
      '2019-37',
      '2019-38',
    ])('renders number of commits by week (YYYY-WW): %s', async (day) => {
      const { getByText, getByPlaceholderText, queryByText, getByTestId, queryByTestId } = render(App)

      await fireEvent.update(getByPlaceholderText(searchPlaceholder), 'marabesi/testable')

      await fireEvent.click(getByText('Load'))

      await waitFor(() => expect(queryByTestId('week')).toBeInTheDocument())

      await fireEvent.click(getByTestId('week'))

      await waitFor(()=> expect(queryByText(day)).toBeInTheDocument())
    })
  })
})