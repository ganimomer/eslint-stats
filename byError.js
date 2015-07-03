'use strict';
module.exports = function(results) {
  var statsUtil = require('./util/statsUtil');
  var displayUtil = require('./util/displayUtil');

  var errorObj = statsUtil.getStats(results, 2);
  return displayUtil.getObjectOutput(errorObj);
};
