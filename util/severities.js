'use strict'

const names = {
  1: 'warnings',
  2: 'errors'
}

const normalize = severity => severity ? [severity] : [1, 2]

module.exports = {names, normalize}