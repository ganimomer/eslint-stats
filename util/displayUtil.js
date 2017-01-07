'use strict';
var chalk = require('chalk');
var _ = require('lodash');

var barColors = {
  errors: 'bgRed',
  warnings: 'bgYellow'
};
var allSeverities = ['errors', 'warnings'];

function maxValue(collection, attr) {
  return _.max(collection, attr)[attr] || 0;
}

function getMaxRuleLength(stats) {
  return maxValue(Object.keys(stats), 'length');
}

function getMaxResult(stats, severity) {
  var severities = [].concat(severity || allSeverities);
  return _.max(severities.map(function (svr) {
    return maxValue(stats, svr);
  }));
}

function getStringLength(num) {
  return ('' + num).length;
}

function getBar(length, color) {
  return chalk[color](_.repeat(' ', length));
}

function normalizeBarLength(num, maxResult, maxBarLength) {
  var result = maxResult < maxBarLength ? num : Math.floor((num / maxResult) * maxBarLength);
  return result;
}

function getObjectOutput(stats) {
  var maxRuleLength = getMaxRuleLength(stats);
  var maxResult = getMaxResult(stats);
  var maxResultLength = getStringLength(maxResult);
  var maxBarLength = process.stdout.columns - maxRuleLength - maxResultLength - (': ' + '|').length;
  var sortedRuleNames = Object.keys(stats).sort();

  return _.map(sortedRuleNames, function (ruleId) {
    return _.map(stats[ruleId], function (count, severity) {
      return _.padRight(ruleId + ': ', maxRuleLength + 2) +
        chalk.magenta(_.padLeft(count, maxResultLength)) + '|' +
        getBar(normalizeBarLength(count, maxResult, maxBarLength), barColors[severity]);
    }).join('\n');
  }, '').join('\n') + '\n';
}

function isAnyRuleStacked(stats) {
  return _.some(stats, function (ruleData) {
    return _.size(ruleData) > 1;
  });
}

function getStackedOutput(stats) {

  if (!isAnyRuleStacked(stats)) {
    return getObjectOutput(stats);
  }
  var maxRuleLength = getMaxRuleLength(stats);
  var maxResults = _.zipObject(allSeverities, allSeverities.map(_.partial(getMaxResult, stats)));
  var maxResultLengths = _.mapValues(maxResults, getStringLength);
  var maxBarLength = process.stdout.columns - maxRuleLength - _.sum(maxResultLengths) - (': ' + ',' + '|').length;

  var getStackedBar = function (ruleStats) {
    var totalLength = _.sum(ruleStats);
    return getBar(normalizeBarLength(ruleStats.errors, totalLength, maxBarLength), barColors.errors) +
      getBar(normalizeBarLength(ruleStats.warnings, totalLength, maxBarLength), barColors.warnings);
  };

  return _.map(stats, function (ruleStats, ruleId) {
      ruleStats = _.defaults({}, ruleStats, _.zipObject(allSeverities, [0, 0]));
      return _.padRight(ruleId + ': ', maxRuleLength + 2) +
        chalk.magenta(_.padLeft(ruleStats.errors, maxResultLengths.errors) + ',' +
          _.padLeft(ruleStats.warnings, maxResultLengths.warnings)) + '|' +
        getStackedBar(ruleStats);
    }).join('\n') + '\n';
}

function getOutputByFolder(stats) {
  return _(stats)
    .pick(_.size)
    .map(function (folderStats, folderName) {
      return chalk.underline(folderName + ':') + '\n' + getObjectOutput(folderStats);
    }).join('');
}

module.exports = {
  getObjectOutput: getObjectOutput,
  getStackedOutput: getStackedOutput,
  getOutputByFolder: getOutputByFolder
};
