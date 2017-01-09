'use strict'
module.exports = function(results) {
  const stats = require('./util/stats')
  const displayUtil = require('./util/chart')

  const warningObj = stats.byRule(results, 1)
  return displayUtil.getObjectOutput(warningObj, process.stdout.columns)
}
