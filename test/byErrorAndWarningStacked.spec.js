'use strict'
describe('byErrorAndWarningStacked', () => {
  const chart = require('../util/chart')
  const stats = require('../util/stats')
  const byErrorAndWarningStacked = require('../byErrorAndWarningStacked')

  it('should receive results and pass them to methods', () => {
    spyOn(stats, 'byRule').and.returnValue('intermediate')
    spyOn(chart, 'getStackedOutput').and.returnValue('output')
    const logOutput = byErrorAndWarningStacked('initial')
    expect(stats.byRule).toHaveBeenCalledWith('initial')
    expect(chart.getStackedOutput).toHaveBeenCalledWith('intermediate', jasmine.any(Number))
    expect(logOutput).toBe('output')
  })

})
