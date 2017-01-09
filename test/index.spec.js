'use strict'
describe('index', () => {

  it('should return this path, followed by "byError"', () => {
    const endpoint = require('../index')
    expect(endpoint.byError).toEqual(`${process.cwd()}/byError.js`)
  })
})
