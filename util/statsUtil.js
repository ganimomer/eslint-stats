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
module.exports = {
  getStats: getStats
};
