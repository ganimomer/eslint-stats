'use strict';
var _ = require('lodash');

function getStats(results, severities) {
  severities = [].concat(severities || [1, 2]);
  var severityNames =
  {
    1: 'warnings',
    2: 'errors'
  };
  return _(results)
    .pluck('messages')
    .flatten()
    .filter(function(message) { return _.includes(severities, message.severity);})
    .groupBy('ruleId')
    .mapValues(function (ruleMessages) {
      return _(ruleMessages)
        .countBy('severity')
        .mapKeys(function (value, key) {
          return severityNames[key];
        })
        .value();
    })
    .value();
}
function getStatsByFolder(results, severities) {
  var path = require('path');
  return _(results)
    .map(function(result) {
      return _.assign({}, result, {folder: path.dirname(result.filePath)});
    })
    .groupBy('folder')
    .mapKeys(function(value, key) { return key === '.' ? 'Base Folder' : key;})
    .mapValues(function(messages) { return getStats(messages, severities);})
    .value();
}
module.exports = {
  getStats: getStats,
  getStatsByFolder: getStatsByFolder
};
