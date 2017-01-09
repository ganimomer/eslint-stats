'use strict';
describe('byWarning', function () {
  const chart = require('../util/chart');
  const stats = require('../util/stats');
  const byWarning = require('../byWarning');

  it('should receive results and pass them to methods', function () {
    spyOn(stats, 'byRule').and.returnValue({semi: {warnings: 2}});
    spyOn(chart, 'getObjectOutput').and.returnValue('output');
    var logOutput = byWarning('initial');
    expect(stats.byRule).toHaveBeenCalledWith('initial', 1);
    expect(chart.getObjectOutput).toHaveBeenCalledWith({semi: {warnings: 2}}, jasmine.any(Number));
    expect(logOutput).toBe('output');
  });

});
