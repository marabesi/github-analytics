import {fireEvent, render, waitFor} from "@testing-library/vue";
import App from "@/App";
import {repositoryName, searchPlaceholder} from "../../../stubs/constants";

describe('bubble chart', () => {
  test('renders tech stack title stats', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(App)

    await fireEvent.update(getByPlaceholderText(searchPlaceholder), repositoryName)

    await fireEvent.click(getByText('Load'))

    await waitFor(()=> expect(queryByText('Tech stack (in bytes - 0)')).toBeInTheDocument())
  })
})
