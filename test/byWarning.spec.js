'use strict'
describe('byWarning', () => {
  const chart = require('../util/chart')
  const stats = require('../util/stats')
  const byWarning = require('../byWarning')

  it('should receive results and pass them to methods', () => {
    spyOn(stats, 'byRule').and.returnValue({semi: {warnings: 2}})
    spyOn(chart, 'getObjectOutput').and.returnValue('output')
    const logOutput = byWarning('initial')
    expect(stats.byRule).toHaveBeenCalledWith('initial', 1)
    expect(chart.getObjectOutput).toHaveBeenCalledWith({semi: {warnings: 2}}, jasmine.any(Number))
    expect(logOutput).toBe('output')
  })

})
