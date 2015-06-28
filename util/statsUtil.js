'use strict';
var _ = require('lodash');

function getReportObjArray(results) {
  var warnings = _(results)
    .pluck('messages')
    .flatten()
    .where({severity: 1})
    .pluck('ruleId')
    .countBy()
    .value();

  var errors = _(results)
    .pluck('messages')
    .flatten()
    .where({severity: 2})
    .pluck('ruleId')
    .countBy()
    .value();

  var errorsObj = _.map(warnings, function(count, rule) {
    var resObj = {};
    resObj[rule] = count;
    return {
      ruleCount: resObj,
      severity: 1
    };
  }, {});

  var warningsObj = _.map(errors, function(count, rule) {
    var resObj = {};
    resObj[rule] = count;
    return {
      ruleCount: resObj,
      severity: 2
    };
  }, {});


  return _.flatten([errorsObj, warningsObj]);
}

module.exports = {
  getReportObjArray: getReportObjArray
};
