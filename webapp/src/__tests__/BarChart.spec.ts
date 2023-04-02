import { fireEvent, render, waitFor } from '@testing-library/vue'
import App from '@/App.vue'
import { repositoryName, searchPlaceholder } from '../../stubs/constants'

describe('barchart data', () => {
  test.each([
    'day',
    'week',
    'month',
    'year'
  ])('renders commits by %s', async (option) => {
    const { getByText, getByPlaceholderText, queryByText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByText(option)).toBeInTheDocument())
  })

  test('by default month should be selected', async () => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByTestId('month')).toBeChecked())
  })

  test.each([
    'day',
    'week',
    'year'
  ])('by default %s should not be selected', async (option) => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByTestId(option)).not.toBeChecked())
  })

  test('renders number of commits by year (YYYY): 2019', async () => {
    const { getByText, getByPlaceholderText, queryByText, queryByTestId, getByTestId } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByTestId('year')).toBeInTheDocument())

    await fireEvent.click(getByTestId('year'))

    await waitFor(() => expect(queryByText('2019')).toBeInTheDocument())
  })

  test('renders number of commits by month (YYYY-MM): 2019-09', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByText('2019-09')).toBeInTheDocument())
  })

  test.each([
    '2019-09-07',
    '2019-09-09',
    '2019-09-14',
    '2019-09-15',
    '2019-09-17',
    '2019-09-18'
  ])('renders number of commits by day (YYYY-MM-DD): %s', async (day) => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, queryByTestId } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByTestId('day')).toBeInTheDocument())

    await fireEvent.click(getByTestId('day'))

    await waitFor(() => expect(queryByText(day)).toBeInTheDocument())
  })

  test.each([
    '2019-36',
    '2019-37',
    '2019-38'
  ])('renders number of commits by week (YYYY-WW): %s', async (day) => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, queryByTestId } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByTestId('week')).toBeInTheDocument())

    await fireEvent.click(getByTestId('week'))

    await waitFor(() => expect(queryByText(day)).toBeInTheDocument())
  })
})
