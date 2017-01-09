'use strict'

const chalk = require('chalk')
const capitalize = require('lodash/capitalize')
const repeat = require('lodash/repeat')

module.exports = {
  getString(length, color) {
    return chalk[color](repeat(' ', length))
  }
}