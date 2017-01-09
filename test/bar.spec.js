'use strict'

const bar = require('../util/bar')
const chalk = require('chalk')

describe('bar', () => {
  describe('getString', () => {
    it('should return a bar of the specified color', () => {
      const expectedResult = chalk.bgRed('     ')
      expect(bar.getString(5, 'bgRed')).toBe(expectedResult)
    })
  })
})