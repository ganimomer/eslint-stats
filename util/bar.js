'use strict'

const chalk = require('chalk')
const repeat = require('lodash/repeat')

module.exports = {
    getString(length, color) {
        return chalk[color](repeat(' ', length))
    }
}