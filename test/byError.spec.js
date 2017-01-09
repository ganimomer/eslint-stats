'use strict'
describe('byError', () => {
  const chart = require('../util/chart')
  const stats = require('../util/stats')
  const byError = require('../byError')

  it('should receive results and pass them to methods', () => {
    spyOn(stats, 'byRule').and.returnValue({semi: {errors: 2}})
    spyOn(chart, 'getObjectOutput').and.returnValue('output')
    const logOutput = byError('initial')
    expect(stats.byRule).toHaveBeenCalledWith('initial', 2)
    expect(chart.getObjectOutput).toHaveBeenCalledWith({semi: {errors: 2}}, jasmine.any(Number))
    expect(logOutput).toBe('output')
  })

})
