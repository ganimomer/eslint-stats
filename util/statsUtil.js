'use strict';
var _ = require('lodash');

function getErrorObject(results) {
  return _(results)
    .pluck('messages')
    .flatten()
    .where({severity: 2})
    .pluck('ruleId')
    .countBy()
    .value();
}

module.exports = {
  getErrorObject: getErrorObject
};
