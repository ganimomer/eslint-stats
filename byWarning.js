'use strict';
module.exports = function(results) {
  var statsUtil = require('./util/statsUtil');
  var displayUtil = require('./util/displayUtil');

  var warningObj = statsUtil.getStats(results, 1);
  return displayUtil.getObjectOutput(warningObj);
};
