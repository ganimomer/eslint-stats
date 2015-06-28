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
      var results = [{ruleCount: {'no-comma-dangle': 7}, severity: 2}];
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(7) + '|' + chalk.bgRed('       ') + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should display warning rules with yellow squares', function() {
      var results = [{ruleCount: {'no-comma-dangle': 7}, severity: 1}];
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(7) + '|' + chalk.bgYellow('       ') + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should display object >=50 with 50 red sqares', function() {
      var results = [{ruleCount: {'no-comma-dangle': 5000}, severity: 2}];
      var maxLen = process.stdout.columns - ('no-comma-dangle: 5000|'.length);
      var redBar = chalk.bgRed(_.repeat(' ', maxLen));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(5000) + '|' + redBar + '\n';
      expectOutput(results, expectedOutput);
    });
  });

  describe('multiple property object', function() {
    it('should pad the results to longest rule', function() {
      var results = [
        {ruleCount: {'no-comma-dangle': 1}, severity: 2},
        {ruleCount: {'no-empty': 1}, severity: 2}
        ];
      var magenta1 = chalk.magenta(1);
      var redBg1 = chalk.bgRed(' ');
      var expectedOutput =
        'no-comma-dangle: ' + magenta1 + '|' + redBg1 + '\n' +
        'no-empty:        ' + magenta1 + '|' + redBg1 + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should pad the results to longest rule with mixed warnings and errors', function() {
      var results = [
        {ruleCount: {'no-comma-dangle': 1}, severity: 2},
        {ruleCount: {'no-empty': 1}, severity: 1}
        ];
      var magenta1 = chalk.magenta(1);
      var redBg1 = chalk.bgRed(' ');
      var yellowBg1 = chalk.bgYellow(' ');
      var expectedOutput =
        'no-comma-dangle: ' + magenta1 + '|' + redBg1 + '\n' +
        'no-empty:        ' + magenta1 + '|' + yellowBg1 + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should padLeft the results to the longest number', function(){
      var results = [
        {ruleCount: {'no-comma-dangle': 1}, severity: 2},
        {ruleCount: {'no-empty': 21}, severity: 2}
        ];
      var redBg21 = chalk.bgRed(_.repeat(' ', 21));
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 1) + '|' + chalk.bgRed(' ') + '\n' +
        'no-empty:        ' + chalk.magenta(21) + '|' + redBg21 + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should padLeft the results to the longest number with mixed warnings and errors', function(){
      var results = [
        {ruleCount: {'no-comma-dangle': 1}, severity: 1},
        {ruleCount: {'no-empty': 21}, severity: 2}
        ];
      var redBg21 = chalk.bgRed(_.repeat(' ', 21));
      var yellowBg1 = chalk.bgYellow(' ');
      var expectedOutput =
        'no-comma-dangle: ' + chalk.magenta(' ' + 1) + '|' + yellowBg1 + '\n' +
        'no-empty:        ' + chalk.magenta(21) + '|' + redBg21 + '\n';
      expectOutput(results, expectedOutput);
    });

    it('should normalize bars, rounding up, if any result > maxLen', function() {
      var results = [
        {ruleCount: {'no-comma-dangle': 150}, severity: 2},
        {ruleCount: {'no-empty': 5000}, severity: 2}
      ];
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
