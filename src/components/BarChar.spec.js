import {mount} from "@vue/test-utils";
import BarChart from "./BarChart";
import {BY_MONTH} from "../constants";

describe('<BarChart />', () => {
  test('Renders svg element without data', () => {
    const wrapper = mount(BarChart, {
      props: {
        data: [],
        by: BY_MONTH,
        width: 100,
        height: 100
      }
    })

    const bar = wrapper.findAll('svg').length

    expect(bar).toBeFalsy()
  })
})