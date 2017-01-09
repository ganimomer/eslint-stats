'use strict';
describe('displayUtil', function () {

  const chalk = require('chalk');
  const bar = require('../util/bar');

  const testBar = (length, color) => `[${color}, ${length}]`;
  beforeEach(() => {
    spyOn(bar, 'getString').and.callFake(testBar);
  });

  const maxWidth = 100

  var chart = require('../util/chart');
  var _ = require('lodash');

  const prettify = input => '\n' + chalk.white(input);

  function expectOutput(results, expectedOutput, isStacked) {
    var method = isStacked ? chart.getStackedOutput : chart.getObjectOutput;
    expect(prettify(method(results, maxWidth))).toBe(prettify(expectedOutput));
  }

  describe('single property object', function () {

    it('should display object < maxBarLength with same number of red squares', function () {
      var stats = {'no-comma-dangle': {errors: 7}};
      var expectedOutput = `no-comma-dangle: ${chalk.magenta(7)}|${testBar(7, 'bgRed')}` + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });

    it('should display warning rules with yellow squares', function () {
      var stats = {'no-comma-dangle': {warnings: 7}};
      var expectedOutput = `no-comma-dangle: ${chalk.magenta(7)}|${testBar(7, 'bgYellow')}` + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });

    it('should display object >= maxWidth with maximum amount of red squares available', function () {
      var stats = {'no-comma-dangle': {errors: 5000}};
      var maxLen = maxWidth - ('no-comma-dangle: 5000|'.length);
      var expectedOutput = 'no-comma-dangle: ' + chalk.magenta(5000) + '|' + testBar(maxLen, 'bgRed') + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });
  });

  describe('multiple property object', function () {
    it('should pad the results to longest rule', function () {
      var stats = {'no-comma-dangle': {errors: 1}, 'no-empty': {errors: 1}};
      var magenta1 = chalk.magenta(1);
      var redBg1 = testBar(1, 'bgRed');
      var expectedOutput =
        'no-comma-dangle: ' + magenta1 + '|' + redBg1 + '\n' +
        'no-empty:        ' + magenta1 + '|' + redBg1 + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });

    it('should pad the results to longest rule with mixed warnings and errors', function () {
      var stats = {
        'no-comma-dangle': {errors: 1},
        'no-empty': {warnings: 1}
      };
      var magenta1 = chalk.magenta(1);
      var redBg1 = testBar(1, 'bgRed');
      var yellowBg1 = testBar(1, 'bgYellow');
      var expectedOutput =
        'no-comma-dangle: ' + magenta1 + '|' + redBg1 + '\n' +
        'no-empty:        ' + magenta1 + '|' + yellowBg1 + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });

    it('should padLeft the results to the longest number', function () {
      var stats = {
        'no-comma-dangle': {errors: 1},
        'no-empty': {errors: 21}
      };
      var redBg21 = testBar(21, 'bgRed');
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 1) + '|' + testBar(1, 'bgRed') + '\n' +
        'no-empty:        ' + chalk.magenta(21) + '|' + redBg21 + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });

    it('should padLeft the results to the longest number with mixed warnings and errors', function () {
      var stats = {
        'no-comma-dangle': {warnings: 1},
        'no-empty': {errors: 21}
      };
      var redBg21 = testBar(21, 'bgRed');
      var yellowBg1 = testBar(1, 'bgYellow');
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 1) + '|' + yellowBg1 + '\n' +
        'no-empty:        ' + chalk.magenta(21) + '|' + redBg21 + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });

    it('should normalize bars, rounding down, if any result > maxLen', function () {
      var stats = {
        'no-comma-dangle': {errors: 150},
        'no-empty': {errors: 5000}
      };
      var maxLen = maxWidth - ('no-comma-dangle: 5000|'.length);
      var redBar = testBar(maxLen, 'bgRed');
      var ratioBar = testBar(Math.floor(150 * maxLen / 5000), 'bgRed');
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 150) + '|' + ratioBar + '\n' +
        'no-empty:        ' + chalk.magenta(5000) + '|' + redBar + '\n';
      expect(prettify(chart.getObjectOutput(stats, maxWidth))).toBe(prettify(expectedOutput));
    });
  });
  describe('stacked output', function () {
    function stackedBar(red, yellow) {
      return testBar(red, 'bgRed') + testBar(yellow, 'bgYellow');
    }

    it('should default back to regular output if there is no rule to stack', function () {
      var stats = {
        'no-comma-dangle': {warnings: 1},
        'no-empty': {errors: 21}
      };
      expect(chart.getStackedOutput(stats, maxWidth)).toEqual(chart.getObjectOutput(stats, maxWidth));
    });
    it('should stack errors first, then warnings', function () {
      var stats = {
        'no-comma-dangle': {warnings: 1, errors: 2}
      };
      var expectedOutput = 'no-comma-dangle: ' + chalk.magenta('2,1') + '|' + stackedBar(2, 1) + '\n';
      expectOutput(stats, expectedOutput, true);
    });

    it('should show zeroes in lines that are not stacked', function () {
      var stats = {
        'no-comma-dangle': {warnings: 1, errors: 2},
        'no-empty': {errors: 3}
      };
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta('2,1') + '|' + stackedBar(2, 1) + '\n' +
        'no-empty:        ' + chalk.magenta('3,0') + '|' + stackedBar(3, 0) + '\n';
      expectOutput(stats, expectedOutput, true);
    });
    it('should pad error numbers and warning numbers separately', function () {
      var stats = {
        'no-comma-dangle': {warnings: 1, errors: 10},
        'no-empty': {errors: 3, warnings: 10}
      };
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta('10, 1') + '|' + stackedBar(10, 1) + '\n' +
        'no-empty:        ' + chalk.magenta(' 3,10') + '|' + stackedBar(3, 10) + '\n';
      expectOutput(stats, expectedOutput, true);
    });
    it('should normalize according to sum of both errors and warnings', function () {
      var stats = {
        'no-comma-dangle': {warnings: 50, errors: 50}
      };
      var stackedBarLength = maxWidth - 'no-comma-dangle: 50,50|'.length;
      var expectedBarLength = Math.floor((stackedBarLength + 4) / 2);
      var expectedOutput = 'no-comma-dangle: ' + chalk.magenta('50,50') + '|' + stackedBar(expectedBarLength, expectedBarLength) + '\n';
      expectOutput(stats, expectedOutput, true);
    });
  });
  describe('getOutputByFolder', function () {
    it('should divide outputs by folder with underline', function () {
      var stats = {
        folder1: {'no-comma-dangle': {errors: 7}},
        folder2: {'no-empty': {errors: 7}}
      };
      var expectedOutput =
        chalk.underline('folder1:') + '\n' + chart.getObjectOutput(stats.folder1, maxWidth) +
        chalk.underline('folder2:') + '\n' + chart.getObjectOutput(stats.folder2, maxWidth);
      expect(prettify(chart.getOutputByFolder(stats, maxWidth))).toEqual(prettify(expectedOutput));
    });
  });
});
