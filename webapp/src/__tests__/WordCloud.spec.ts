import { fireEvent, render, waitFor } from '@testing-library/vue'
import App from '@/App.vue'
import { repositoryName, searchPlaceholder } from '../../stubs/constants'

describe('word cloud', () => {
  test('renders topics title', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(() => expect(queryByText('Topics (0)')).toBeInTheDocument())
  })
})
