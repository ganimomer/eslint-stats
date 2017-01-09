'use strict'
module.exports = function(results) {
  const stats = require('./util/stats')
  const displayUtil = require('./util/chart')
  const errorObj = stats.byRule(results, 2)
  return displayUtil.getObjectOutput(errorObj, process.stdout.columns)
}
