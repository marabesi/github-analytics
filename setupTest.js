require('jest-fetch-mock').enableMocks()
global.URL.createObjectURL = jest.fn();