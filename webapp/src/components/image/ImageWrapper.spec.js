require('jest-fetch-mock').enableMocks()

import { render, waitFor, waitForElementToBeRemoved } from "@testing-library/vue";
import ImageWrapper from './ImageWrapper.vue'

const src = 'http://www.my.com/ggg.png'

describe('ImageWrapper component', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn();
    fetchMock.doMock()

    const mockFetchPromise = Promise.resolve({
      blob: () => Promise.resolve(new Blob()),
    })

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)
  })

  afterEach(() => {
    fetchMock.dontMock()
  })

  test('should show up loading placeholder', async () => {
    const { queryByText } = render(ImageWrapper, {
      propsData: {
        src
      }
    })

    await waitFor(() =>
      expect(queryByText('Loading...')).toBeTruthy()
    )
  })

  test('should hide loading placeholder when image loading is completed', async () => {
    const { queryByText } = render(ImageWrapper, {
      propsData: {
        src
      }
    })

    await waitForElementToBeRemoved(() => queryByText('Loading...'))
  })

  test('should show image once loading is completed', async () => {
    const { queryByTestId } = render(ImageWrapper, {
      propsData: {
        src
      }
    })

    await waitFor(() => expect(queryByTestId('image')).toBeTruthy())
  })
})
