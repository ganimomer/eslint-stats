'use strict';
describe('displayUtil', function() {

  var chalk = require('chalk');
  var displayUtil = require('../util/displayUtil');
  var _ = require('lodash');

  function expectOutput(results, expectedOutput) {
    expect('\n' + displayUtil.getObjectOutput(results)).toBe('\n' + expectedOutput);
  }

  describe('single property object', function() {

    it('should display object < maxBarLength with same number of red squares', function() {
      var results = {'no-comma-dangle': 7};
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(7) + '|' + chalk.bgRed('       ') + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should display object >=50 with 50 red sqares', function() {
      var results = {'no-comma-dangle': 5000};
      var maxLen = process.stdout.columns - ('no-comma-dangle: 5000|'.length);
      var redBar = chalk.bgRed(_.repeat(' ', maxLen));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(5000) + '|' + redBar + '\n';
      expectOutput(results, expectedOutput);
    });
  });

  describe('multiple property object', function() {
    it('should pad the results to longest rule', function() {
      var results = {
        'no-comma-dangle': 1,
        'no-empty': 1
      };
      var magenta1 = chalk.magenta(1);
      var redBg1 = chalk.bgRed(' ');
      var expectedOutput =
        'no-comma-dangle: ' + magenta1 + '|' + redBg1 + '\n' +
        'no-empty:        ' + magenta1 + '|' + redBg1 + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should padLeft the results to the longest number', function(){
      var results = {
        'no-comma-dangle': 1,
        'no-empty': 21
      };
      var redBg21 = chalk.bgRed(_.repeat(' ', 21));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 1) + '|' + chalk.bgRed(' ') + '\n' +
        'no-empty:        ' + chalk.magenta(21) + '|' + redBg21 + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should normalize bars, rounding up, if any result > maxLen', function() {
      var results = {
        'no-comma-dangle': 150,
        'no-empty': 5000
      };
      var maxLen = process.stdout.columns - ('no-comma-dangle: 5000|'.length);
      var redBar = chalk.bgRed(_.repeat(' ', maxLen));
      var ratioBar = chalk.bgRed(_.repeat(' ', Math.ceil(150 * maxLen / 5000)));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 150) + '|' + ratioBar + '\n' +
        'no-empty:        ' + chalk.magenta(5000) + '|' + redBar + '\n';
      expectOutput(results, expectedOutput);
    });
  });
});
