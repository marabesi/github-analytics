import fakeGithubApi from './stubs/github.commits.json'
import fakeGithubTopics from './stubs/github.empty.topics.json'
import fakeEmptyGithubLanguages from './stubs/github.empty.languages.json'

import fetchMock from 'jest-fetch-mock'

import '@testing-library/jest-dom'

fetchMock.enableMocks()
beforeEach(() => {
  global.URL.createObjectURL = jest.fn()
  fetchMock.mockIf(/^https?:\/\/api\.github\.com.*$/, (request: any): any => {
    if (request.url.indexOf('commits') !== -1) {
      return Promise.resolve({
        headers: {
          'Content-type': 'application/json',
          link: '<https://api.github.com/repositories/136395473/commits?client_id=undefined&client_secret=undefined&page=1>; rel="first", <https://api.github.com/repositories/136395473/commits?client_id=undefined&client_secret=undefined&page=53>; rel="prev"'
        },
        body: JSON.stringify(fakeGithubApi)
      })
    }

    if (request.url.indexOf('topics') !== -1) {
      return Promise.resolve({
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(fakeGithubTopics)
      })
    }

    if (request.url.indexOf('languages') !== -1) {
      return Promise.resolve({
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(fakeEmptyGithubLanguages)
      })
    }

    return {
      status: 404,
      headers: {
        'Content-type': 'application/json'
      },
      body: 'Not Found'
    }
  })
})

afterEach(() => {
  fetchMock.dontMock()
})
