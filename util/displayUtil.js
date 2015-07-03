'use strict';
var chalk = require('chalk');
var _ = require('lodash');

var barColors = {
  errors: 'bgRed',
  warnings: 'bgYellow'
};

function maxValue(collection, attr) {
  return _.max(collection, attr)[attr] || 0;
}

function getMaxRuleLength(stats) {
  return maxValue(Object.keys(stats), 'length');
}

function getMaxResult(stats) {
  return Math.max(maxValue(stats, 'errors'), maxValue(stats, 'warnings'));
}

function getBar(length, color) {
  return chalk[color](_.repeat(' ', length));
}

function getObjectOutput(stats) {
  var maxRuleLength = getMaxRuleLength(stats);
  var maxResult = getMaxResult(stats);
  var maxResultLength = ('' + maxResult).length;
  var maxBarLength = process.stdout.columns - maxRuleLength - maxResultLength - (': ' + '|').length;
  var normalizeBarLength = function (num) {
    return maxResult < maxBarLength ? num : Math.ceil((num / maxResult) * maxBarLength);
  };

  return _.map(stats, function (ruleStats, ruleId) {
      return _.map(ruleStats, function (count, severity) {
        return _.padRight(ruleId + ': ', maxRuleLength + 2) +
          chalk.magenta(_.padLeft(count, maxResultLength)) + '|' +
          getBar(normalizeBarLength(count), barColors[severity]);
      }).join('\n');
    }, '').join('\n') + '\n';
}

module.exports = {
  getObjectOutput: getObjectOutput
};
