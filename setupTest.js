import fakeGithubApi from "@/githuapi.json";
import '@testing-library/jest-dom'

require('jest-fetch-mock').enableMocks()

beforeEach(() => {
  global.URL.createObjectURL = jest.fn();
  fetchMock.mockIf(/commits/, () => {
    return Promise.resolve({
      headers: {
        "Content-type": "application/json",
        "link": '<https://api.github.com/repositories/136395473/commits?client_id=undefined&client_secret=undefined&page=1>; rel="first", <https://api.github.com/repositories/136395473/commits?client_id=undefined&client_secret=undefined&page=53>; rel="prev"'
      },
      body: JSON.stringify(fakeGithubApi),
    })
  })
})

afterEach(() => {
  fetchMock.dontMock()
})
