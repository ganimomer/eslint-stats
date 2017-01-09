'use strict'
const chalk = require('chalk')
const _ = require('lodash')
const bar = require('./bar')

const barColors = {
  errors: 'bgRed',
  warnings: 'bgYellow'
}

const allSeverities = ['errors', 'warnings']

function getMaxRuleLength(stats) {
  return _(stats).keys().map('length').max()
}

function getStringLength(num) {
  return String(num).length
}

const getBarRatio = (usedColumns, maxResult, maxWidth) => {
  const maxBarLength = maxWidth - usedColumns
  return maxResult <= maxBarLength ? 1 : maxBarLength / maxResult
}

const sortByKey = obj => _(obj).keys().sortBy().map(_.propertyOf(obj)).value()

function getObjectOutput(stats, maxWidth) {
  const maxRuleLength = getMaxRuleLength(stats)
  const maxResult = _(stats).flatMap(ruleStats => [ruleStats.errors || 0, ruleStats.warnings || 0]).max()
  const maxResultLength = String(maxResult).length

  const barRatio = getBarRatio(maxRuleLength + maxResultLength + 3, maxResult, maxWidth)

  const getRuleOutput = (ruleStats, ruleName) => {
    const ruleCell = _.padEnd(`${ruleName}: `, maxRuleLength + 2)
    return _.map(ruleStats, (count, severity) => {
      const countCell = chalk.magenta(_.padStart(count, maxResultLength))
      const barCell = bar.getString(Math.floor(barRatio * count), barColors[severity])
      return `${ruleCell}${countCell}|${barCell}`
    }).join('\n')
  }


  return `${sortByKey(_.mapValues(stats, getRuleOutput)).join('\n')}\n`
}

function isAnyRuleStacked(stats) {
  return _.some(stats, ruleData => _.size(ruleData) > 1)
}

function getStackedOutput(stats, maxWidth) {
  if (!isAnyRuleStacked(stats)) {
    return getObjectOutput(stats, maxWidth)
  }

  const normalizedStats = _.mapValues(stats, ruleStats => _.assign({errors: 0, warnings: 0}, ruleStats))
  const maxRuleLength = getMaxRuleLength(normalizedStats)
  const maxResults = _.zipObject(allSeverities, allSeverities.map(severity => _(stats).map(severity).max()))
  const maxResultLengths = _.mapValues(maxResults, getStringLength)
  const maxRuleSum = _(normalizedStats).map(x => x.errors + x.warnings).max()

  const barRatio = getBarRatio(maxRuleLength + _.sum(maxResultLengths) + 4, maxRuleSum, maxWidth)

  const getStackedBar = ruleStats => bar.getString(Math.floor(barRatio * ruleStats.errors), barColors.errors) + bar.getString(Math.floor(barRatio * ruleStats.warnings), barColors.warnings)

  return `${_.map(normalizedStats, (ruleStats, ruleId) => {
      const ruleCell = _.padEnd(`${ruleId}: `, maxRuleLength + 2)
      const errorCountCell = (_.padStart(ruleStats.errors, maxResultLengths.errors))
      const warningCountCell = _.padStart(ruleStats.warnings, maxResultLengths.warnings)
      const countCell = chalk.magenta(`${errorCountCell},${warningCountCell}`)
      const barCell = getStackedBar(ruleStats)
      return `${ruleCell}${countCell}|${barCell}`
    }).join('\n')}\n`
}

const getFolderOutput = maxWidth => (folderStats, folderName) => `${chalk.underline(`${folderName}:`)}\n${getObjectOutput(folderStats, maxWidth)}`

function getOutputByFolder(stats, maxWidth) {
  return _(stats)
    .pickBy(_.size)
    .map(getFolderOutput(maxWidth))
    .join('')
}

module.exports = {
  getObjectOutput,
  getStackedOutput,
  getOutputByFolder
}
