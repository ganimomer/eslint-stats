'use strict'

module.exports = {
  byError: require('path').join(__dirname, 'byError.js'),
  byWarning: require('path').join(__dirname, 'byWarning.js'),
  byErrorAndWarning: require('path').join(__dirname, 'byErrorAndWarning.js'),
  byErrorAndWarningStacked: require('path').join(__dirname, 'byErrorAndWarningStacked.js'),
  byFolder: require('path').join(__dirname, 'byFolder.js')
}
