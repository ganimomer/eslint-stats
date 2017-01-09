'use strict'
describe('byErrorAndWarning', () => {
  const chart = require('../util/chart')
  const stats = require('../util/stats')
  const byErrorAndWarning = require('../byErrorAndWarning')

  it('should receive results and pass them to methods', () => {
    spyOn(stats, 'byRule').and.returnValue('intermediate')
    spyOn(chart, 'getObjectOutput').and.returnValue('output')
    const logOutput = byErrorAndWarning('initial')
    expect(stats.byRule).toHaveBeenCalledWith('initial')
    expect(chart.getObjectOutput).toHaveBeenCalledWith('intermediate', jasmine.any(Number))
    expect(logOutput).toBe('output')
  })

})
