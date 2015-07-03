'use strict';
var _ = require('lodash');

module.exports = function(results) {
  var statsUtil = require('./util/statsUtil');
  var displayUtil = require('./util/displayUtil');

  var warningObj = _.filter(statsUtil.getReportObjArray(results), {severity: 1});
  return displayUtil.getObjectOutput(warningObj);
};
