'use strict'

module.exports = function(results) {
  const stats = require('./util/stats')
  const displayUtil = require('./util/chart')
  const obj = stats.byFolderAndRule(results)
  return displayUtil.getOutputByFolder(obj, process.stdout.columns)
}
