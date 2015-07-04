'use strict';
describe('displayUtil', function () {

  var chalk = require('chalk');
  var displayUtil = require('../util/displayUtil');
  var _ = require('lodash');

  function expectOutput(results, expectedOutput, isStacked) {
    var method = isStacked ? displayUtil.getStackedOutput : displayUtil.getObjectOutput;
    expect('\n' + chalk.white(method(results))).toBe('\n' + chalk.white(expectedOutput));
  }

  describe('single property object', function () {

    it('should display object < maxBarLength with same number of red squares', function () {
      var stats = {'no-comma-dangle': {errors: 7}};
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(7) + '|' + chalk.bgRed('       ') + '\n';
      expectOutput(stats, expectedOutput);
    });

    it('should display warning rules with yellow squares', function () {
      var stats = {'no-comma-dangle': {warnings: 7}};
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(7) + '|' + chalk.bgYellow('       ') + '\n';
      expectOutput(stats, expectedOutput);
    });

    it('should display object >=50 with 50 red squares', function () {
      var stats = {'no-comma-dangle': {errors: 5000}};//[{ruleCount: {'no-comma-dangle': 5000}, severity: 2}];
      var maxLen = process.stdout.columns - ('no-comma-dangle: 5000|'.length);
      var redBar = chalk.bgRed(_.repeat(' ', maxLen));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(5000) + '|' + redBar + '\n';
      expectOutput(stats, expectedOutput);
    });
  });

  describe('multiple property object', function () {
    it('should pad the results to longest rule', function () {
      var stats = {'no-comma-dangle': {errors: 1}, 'no-empty': {errors: 1}};
      var magenta1 = chalk.magenta(1);
      var redBg1 = chalk.bgRed(' ');
      var expectedOutput =
        'no-comma-dangle: ' + magenta1 + '|' + redBg1 + '\n' +
        'no-empty:        ' + magenta1 + '|' + redBg1 + '\n';
      expectOutput(stats, expectedOutput);
    });

    it('should pad the results to longest rule with mixed warnings and errors', function () {
      var stats = {
        'no-comma-dangle': {errors: 1},
        'no-empty': {warnings: 1}
      };
      var magenta1 = chalk.magenta(1);
      var redBg1 = chalk.bgRed(' ');
      var yellowBg1 = chalk.bgYellow(' ');
      var expectedOutput =
        'no-comma-dangle: ' + magenta1 + '|' + redBg1 + '\n' +
        'no-empty:        ' + magenta1 + '|' + yellowBg1 + '\n';
      expectOutput(stats, expectedOutput);
    });

    it('should padLeft the results to the longest number', function () {
      var stats = {
        'no-comma-dangle': {errors: 1},
        'no-empty': {errors: 21}
      };
      var redBg21 = chalk.bgRed(_.repeat(' ', 21));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 1) + '|' + chalk.bgRed(' ') + '\n' +
        'no-empty:        ' + chalk.magenta(21) + '|' + redBg21 + '\n';
      expectOutput(stats, expectedOutput);
    });

    it('should padLeft the results to the longest number with mixed warnings and errors', function () {
      var stats = {
        'no-comma-dangle': {warnings: 1},
        'no-empty': {errors: 21}
      };
      var redBg21 = chalk.bgRed(_.repeat(' ', 21));
      var yellowBg1 = chalk.bgYellow(' ');
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 1) + '|' + yellowBg1 + '\n' +
        'no-empty:        ' + chalk.magenta(21) + '|' + redBg21 + '\n';
      expectOutput(stats, expectedOutput);
    });

    it('should normalize bars, rounding down, if any result > maxLen', function () {
      var stats = {
        'no-comma-dangle': {errors: 150},
        'no-empty': {errors: 5000}
      };
      var maxLen = process.stdout.columns - ('no-comma-dangle: 5000|'.length);
      var redBar = chalk.bgRed(_.repeat(' ', maxLen));
      var ratioBar = chalk.bgRed(_.repeat(' ', Math.floor(150 * maxLen / 5000)));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 150) + '|' + ratioBar + '\n' +
        'no-empty:        ' + chalk.magenta(5000) + '|' + redBar + '\n';
      expectOutput(stats, expectedOutput);
    });
  });
  describe('stacked output', function () {
    function stackedBar(red, yellow) {
      return chalk.bgRed(_.repeat(' ', red)) + chalk.bgYellow(_.repeat(' ', yellow));
    }

    it('should default back to regular output if there is no rule to stack', function () {
      var stats = {
        'no-comma-dangle': {warnings: 1},
        'no-empty': {errors: 21}
      };
      expect(displayUtil.getStackedOutput(stats)).toEqual(displayUtil.getObjectOutput(stats));
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
      var halfTheScreen = process.stdout.columns / 2;
      var stats = {
        'no-comma-dangle': {warnings: halfTheScreen, errors: halfTheScreen}
      };
      var stackedBarLength = process.stdout.columns - 'no-comma-dangle: ,|'.length - (('' + halfTheScreen).length * 2);
      var expectedBarLength = Math.floor(stackedBarLength / 2);
      var expectedOutput = 'no-comma-dangle: ' + chalk.magenta(halfTheScreen + ',' + halfTheScreen) + '|' +
        stackedBar(expectedBarLength, expectedBarLength) + '\n';
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
        chalk.underline('folder1:') + '\n' + displayUtil.getObjectOutput(stats.folder1) +
        chalk.underline('folder2:') + '\n' + displayUtil.getObjectOutput(stats.folder2);
      expect('\n' + displayUtil.getOutputByFolder(stats)).toEqual('\n' + expectedOutput);
    });
  });
});
