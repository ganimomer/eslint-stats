'use strict';
module.exports = function(results) {
  var stats = require('./util/stats');
  var displayUtil = require('./util/chart');

  var warningObj = stats.byRule(results, 1);
  return displayUtil.getObjectOutput(warningObj, process.stdout.columns);
};
