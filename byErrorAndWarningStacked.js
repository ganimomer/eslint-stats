'use strict';

module.exports = function(results) {
  var statsUtil = require('./util/statsUtil');
  var displayUtil = require('./util/displayUtil');

  var obj = statsUtil.getStats(results);
  return displayUtil.getStackedOutput(obj);
};
