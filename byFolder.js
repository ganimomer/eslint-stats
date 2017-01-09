'use strict';

module.exports = function(results) {
  var stats = require('./util/stats');
  var displayUtil = require('./util/chart');
  var obj = stats.byFolderAndRule(results);
  return displayUtil.getOutputByFolder(obj, process.stdout.columns);
};
