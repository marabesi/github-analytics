import { mount } from '@vue/test-utils'
import App from './App'
import InputText from "./components/search/InputText";

describe('<App />', () => {

  test('Display input text when loading is false', () => {
    const wrapper = mount(App)
    const inputText = wrapper.findComponent(InputText)
    expect(inputText).toBeTruthy()
  })

  test('Not display repo title if empty', () => {
    const wrapper = mount(App)
    const title = wrapper.findAll('h1').length
    expect(title).toBeFalsy()
  })
})