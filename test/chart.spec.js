'use strict'
describe('displayUtil', () => {

  const chalk = require('chalk')
  const bar = require('../util/bar')

  const testBar = (length, color) => `[${color}, ${length}]`
  beforeEach(() => {
    spyOn(bar, 'getString').and.callFake(testBar)
  })

  const maxWidth = 100

  const chart = require('../util/chart')
  const _ = require('lodash')

  const prettify = input => `\n${chalk.white(input)}`

  function expectOutput(results, expectedOutput, isStacked) {
    const method = isStacked ? chart.getStackedOutput : chart.getObjectOutput
    expect(prettify(method(results, maxWidth))).toBe(prettify(expectedOutput))
  }

  describe('single property object', () => {

    it('should display object < maxBarLength with same number of red squares', () => {
      const stats = {'no-comma-dangle': {errors: 7}}
      const expectedOutput = `no-comma-dangle: ${chalk.magenta(7)}|${testBar(7, 'bgRed')}` + '\n'
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })

    it('should display warning rules with yellow squares', () => {
      const stats = {'no-comma-dangle': {warnings: 7}}
      const expectedOutput = `no-comma-dangle: ${chalk.magenta(7)}|${testBar(7, 'bgYellow')}` + '\n'
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })

    it('should display object >= maxWidth with maximum amount of red squares available', () => {
      const stats = {'no-comma-dangle': {errors: 5000}}
      const maxLen = maxWidth - ('no-comma-dangle: 5000|'.length)
      const expectedOutput = `no-comma-dangle: ${chalk.magenta(5000)}|${testBar(maxLen, 'bgRed')}\n`
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })
  })

  describe('multiple property object', () => {
    it('should pad the results to longest rule', () => {
      const stats = {'no-comma-dangle': {errors: 1}, 'no-empty': {errors: 1}}
      const magenta1 = chalk.magenta(1)
      const redBg1 = testBar(1, 'bgRed')
      const expectedOutput =
        `no-comma-dangle: ${magenta1}|${redBg1}\n` +
        `no-empty:        ${magenta1}|${redBg1}\n`
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })

    it('should pad the results to longest rule with mixed warnings and errors', () => {
      const stats = {
        'no-comma-dangle': {errors: 1},
        'no-empty': {warnings: 1}
      }
      const magenta1 = chalk.magenta(1)
      const redBg1 = testBar(1, 'bgRed')
      const yellowBg1 = testBar(1, 'bgYellow')
      const expectedOutput =
        `no-comma-dangle: ${magenta1}|${redBg1}\n` +
        `no-empty:        ${magenta1}|${yellowBg1}\n`
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })

    it('should padLeft the results to the longest number', () => {
      const stats = {
        'no-comma-dangle': {errors: 1},
        'no-empty': {errors: 21}
      }
      const redBg21 = testBar(21, 'bgRed')
      const expectedOutput =
        `no-comma-dangle: ${chalk.magenta(` ${1}`)}|${testBar(1, 'bgRed')}\n` +
        `no-empty:        ${chalk.magenta(21)}|${redBg21}\n`
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })

    it('should padLeft the results to the longest number with mixed warnings and errors', () => {
      const stats = {
        'no-comma-dangle': {warnings: 1},
        'no-empty': {errors: 21}
      }
      const redBg21 = testBar(21, 'bgRed')
      const yellowBg1 = testBar(1, 'bgYellow')
      const expectedOutput =
        `no-comma-dangle: ${chalk.magenta(` ${1}`)}|${yellowBg1}\n` +
        `no-empty:        ${chalk.magenta(21)}|${redBg21}\n`
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })

    it('should normalize bars, rounding down, if any result > maxLen', () => {
      const stats = {
        'no-comma-dangle': {errors: 150},
        'no-empty': {errors: 5000}
      }
      const maxLen = maxWidth - ('no-comma-dangle: 5000|'.length)
      const redBar = testBar(maxLen, 'bgRed')
      const ratioBar = testBar(Math.floor(150 * maxLen / 5000), 'bgRed')
      const expectedOutput =
        `no-comma-dangle: ${chalk.magenta(` ${150}`)}|${ratioBar}\n` +
        `no-empty:        ${chalk.magenta(5000)}|${redBar}\n`
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput))
    })
  })
  describe('stacked output', () => {
    function stackedBar(red, yellow) {
      return testBar(red, 'bgRed') + testBar(yellow, 'bgYellow')
    }

    it('should default back to regular output if there is no rule to stack', () => {
      const stats = {
        'no-comma-dangle': {warnings: 1},
        'no-empty': {errors: 21}
      }
      expect(chart.getStackedOutput(stats, maxWidth)).toEqual(chart.getObjectOutput(stats, maxWidth))
    })
    it('should stack errors first, then warnings', () => {
      const stats = {
        'no-comma-dangle': {warnings: 1, errors: 2}
      }
      const expectedOutput = `no-comma-dangle: ${chalk.magenta('2,1')}|${stackedBar(2, 1)}\n`
      expectOutput(stats, expectedOutput, true)
    })

    it('should show zeroes in lines that are not stacked', () => {
      const stats = {
        'no-comma-dangle': {warnings: 1, errors: 2},
        'no-empty': {errors: 3}
      }
      const expectedOutput =
        `no-comma-dangle: ${chalk.magenta('2,1')}|${stackedBar(2, 1)}\n` +
        `no-empty:        ${chalk.magenta('3,0')}|${stackedBar(3, 0)}\n`
      expectOutput(stats, expectedOutput, true)
    })
    it('should pad error numbers and warning numbers separately', () => {
      const stats = {
        'no-comma-dangle': {warnings: 1, errors: 10},
        'no-empty': {errors: 3, warnings: 10}
      }
      const expectedOutput =
        `no-comma-dangle: ${chalk.magenta('10, 1')}|${stackedBar(10, 1)}\n` +
        `no-empty:        ${chalk.magenta(' 3,10')}|${stackedBar(3, 10)}\n`
      expectOutput(stats, expectedOutput, true)
    })
    it('should normalize according to sum of both errors and warnings', () => {
      const stats = {
        'no-comma-dangle': {warnings: 50, errors: 50}
      }
      const stackedBarLength = maxWidth - 'no-comma-dangle: 50,50|'.length
      const expectedBarLength = Math.floor((stackedBarLength + 4) / 2)
      const expectedOutput = `no-comma-dangle: ${chalk.magenta('50,50')}|${stackedBar(expectedBarLength, expectedBarLength)}\n`
      expectOutput(stats, expectedOutput, true)
    })
  })
  describe('getOutputByFolder', () => {
    it('should divide outputs by folder with underline', () => {
      const stats = {
        folder1: {'no-comma-dangle': {errors: 7}},
        folder2: {'no-empty': {errors: 7}}
      }
      const expectedOutput =
        `${chalk.underline('folder1:')}\n${chart.getObjectOutput(stats.folder1, maxWidth) 
        }${chalk.underline('folder2:')}\n${chart.getObjectOutput(stats.folder2, maxWidth)}`
      expect(prettify(chart.getOutputByFolder(stats, maxWidth))).toEqual(prettify(expectedOutput))
    })
  })
})
