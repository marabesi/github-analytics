import {fireEvent, render, waitFor} from '@testing-library/vue'
import App from './App'
import {repositoryName, searchPlaceholder} from "../stubs/constants";

describe('authors', () => {
  test('renders author name', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(()=> expect(queryByText('marabesi')).toBeInTheDocument())
  })

  test('should display author commits by default', async () => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(()=> expect(queryByTestId('marabesi')).toBeChecked())
  })

  test('renders author count', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(()=> expect(queryByText('Authors (1)')).toBeInTheDocument())
  })
})
