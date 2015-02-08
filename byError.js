'use strict';
module.exports = function(results) {
  var statsUtil = require('./util/statsUtil');
  var displayUtil = require('./util/displayUtil');

  var errorObj = statsUtil.getErrorObject(results);
  return displayUtil.getObjectOutput(errorObj);
};
