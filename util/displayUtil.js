'use strict';
var chalk = require('chalk');
var _ = require('lodash');
var maxBarLength;

function getMaxRuleLength(results) {
  return Math.max.apply(Math, _.map(results, function(val, key) {
    return key.length;
  }));
}

function getMaxResult(results) {
  return _.max(results);
}

function normalizeBarLength(num, maxResult) {
  return maxResult < maxBarLength ? num : Math.ceil((num / maxResult) * maxBarLength);
}

function getBar(length) {
  return chalk.bgRed(_.repeat(' ', length));
}

function getObjectOutput(results) {
  var maxRuleLength = getMaxRuleLength(results);
  var maxResult = getMaxResult(results);
  var maxResultLength = ('' + maxResult).length;
  var otherLength = (': ' + '|').length;
  maxBarLength = process.stdout.columns - maxRuleLength - maxResultLength - otherLength;
  return _.reduce(results, function(soFar, num, rule) {
    return soFar + _.padRight(rule + ': ', maxRuleLength + 2) +
      chalk.magenta(_.padLeft(num, maxResultLength)) + '|' +
    getBar(normalizeBarLength(num, maxResult)) + '\n';
  }, '');
}

module.exports = {
  getObjectOutput: getObjectOutput
};
