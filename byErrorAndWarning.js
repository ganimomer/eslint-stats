'use strict'

module.exports = function(results) {
  const stats = require('./util/stats')
  const displayUtil = require('./util/chart')

  const obj = stats.byRule(results)
  return displayUtil.getObjectOutput(obj, process.stdout.columns)
}
