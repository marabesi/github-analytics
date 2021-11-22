import fakeGithubApi from "@/githuapi.json"
import fakeGithubTopics from "@/github.empty.topics.json"
import fakeGithubLanguages from "@/github.empty.languages.json"

import '@testing-library/jest-dom'

require('jest-fetch-mock').enableMocks()

beforeEach(() => {
  global.URL.createObjectURL = jest.fn();
  fetchMock.mockIf(/^https?:\/\/api\.github\.com.*$/, request => {

    if (request.url.indexOf('commits') !== -1) {
      return Promise.resolve({
        headers: {
          "Content-type": "application/json",
          "link": '<https://api.github.com/repositories/136395473/commits?client_id=undefined&client_secret=undefined&page=1>; rel="first", <https://api.github.com/repositories/136395473/commits?client_id=undefined&client_secret=undefined&page=53>; rel="prev"'
        },
        body: JSON.stringify(fakeGithubApi),
      })
    }

    if (request.url.indexOf('topics') !== -1) {
      return Promise.resolve({
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(fakeGithubTopics),
      })
    }

    if (request.url.indexOf('languages') !== -1) {
      return Promise.resolve({
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(fakeGithubLanguages),
      })
    }

    return {
      status: 404,
      headers: {
        "Content-type": "application/json",
      },
      body: "Not Found"
    }
  })
})

afterEach(() => {
  fetchMock.dontMock()
})
