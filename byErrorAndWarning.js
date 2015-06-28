'use strict';

module.exports = function(results) {
  var statsUtil = require('./util/statsUtil');
  var displayUtil = require('./util/displayUtil');

  var obj = statsUtil.getReportObjArray(results);
  return displayUtil.getObjectOutput(obj);
};
