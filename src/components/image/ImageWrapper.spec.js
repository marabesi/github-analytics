import { mount } from '@vue/test-utils'
import ImageWrapper from './ImageWrapper.vue'

const src = 'http://www.my.com/ggg.png'

describe('ImageWrapper component', () => {
  test('should show up loading placeholder', () => {
    const wrapper = mount(ImageWrapper, {
      propsData: {
        src
      }
    })

    expect(wrapper.findAll('.loading').length).toEqual(1)
    expect(wrapper.findAll('img').length).toEqual(0)
  })

  test('should hide loading placeholder when image loading is completed', done => {
    const mockFetchPromise = Promise.resolve({
      blob: () => Promise.resolve(new Blob()),
    })

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

    const wrapper = mount(ImageWrapper, {
      propsData: {
        src
      }
    })

    setTimeout(() => {
      expect(wrapper.findAll('.loading').length).toEqual(0)
    expect(wrapper.findAll('img').length).toEqual(1)
      done()
    }, 1)
  })
})