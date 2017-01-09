'use strict';

module.exports = function(results) {
  var stats = require('./util/stats');
  var displayUtil = require('./util/chart');

  var obj = stats.byRule(results);
  return displayUtil.getStackedOutput(obj, process.stdout.columns);
};
