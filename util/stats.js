'use strict'
const path = require('path')
const countBy = require('lodash/countBy')
const mapKeys = require('lodash/mapKeys')
const mapValues = require('lodash/mapValues')
const castArray = require('lodash/castArray')
const flatMap = require('lodash/flatMap')
const filter = require('lodash/filter')
const includes = require('lodash/includes')
const groupBy = require('lodash/groupBy')

const severities = require('./severities')

const getStatsForRule = ruleMessages => countBy(ruleMessages, message => severities.names[message.severity])

function byRule(results, severity) {
  const allMessages = flatMap(results, 'messages')
  const messagesInSeverities = severity ? filter(allMessages, {severity}) : allMessages
  const messagesByRuleId = groupBy(messagesInSeverities, 'ruleId')
  return mapValues(messagesByRuleId, getStatsForRule)
}

const getDirName = result => {
  const dirname = path.dirname(result.filePath)
  return dirname === '.' ? 'Base Folder' : dirname
}

function byFolderAndRule(results, severity) {
  const byDirName = groupBy(results, getDirName)
  return mapValues(byDirName, messages => byRule(messages, severity))
}

module.exports = {
  byRule,
  byFolderAndRule
}
