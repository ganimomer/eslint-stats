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

function getBar(length, severity) {
  if (severity === 1) {
    return chalk.bgYellow(_.repeat(' ', length));
  } else if (severity === 2) {
    return chalk.bgRed(_.repeat(' ', length));
  }
}

function getObjectOutput(fullResults) {
  var results = _.reduce(_.pluck(fullResults, 'ruleCount'), function(result, resObj) {
    return _.assign(result, resObj);
  }, {});
  var maxRuleLength = getMaxRuleLength(results);
  var maxResult = getMaxResult(results);
  var maxResultLength = ('' + maxResult).length;
  var otherLength = (': ' + '|').length;
  maxBarLength = process.stdout.columns - maxRuleLength - maxResultLength - otherLength;

  return _.reduce(fullResults, function(soFar, resObj) {
    var rule = _.keys(resObj.ruleCount)[0];
    var num = resObj.ruleCount[rule];
    var severity = resObj.severity;
    return soFar + _.padRight(rule + ': ', maxRuleLength + 2) +
      chalk.magenta(_.padLeft(num, maxResultLength)) + '|' +
      getBar(normalizeBarLength(num, maxResult), severity) + '\n';
  }, '');
}

module.exports = {
  getObjectOutput: getObjectOutput
};
