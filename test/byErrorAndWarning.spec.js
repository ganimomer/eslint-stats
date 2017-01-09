'use strict';
describe('byErrorAndWarning', function() {
  const chart = require('../util/chart');
  const stats = require('../util/stats');
  const byErrorAndWarning = require('../byErrorAndWarning');

  it('should receive results and pass them to methods', function() {
    spyOn(stats, 'byRule').and.returnValue('intermediate');
    spyOn(chart, 'getObjectOutput').and.returnValue('output');
    var logOutput = byErrorAndWarning('initial');
    expect(stats.byRule).toHaveBeenCalledWith('initial');
    expect(chart.getObjectOutput).toHaveBeenCalledWith('intermediate', jasmine.any(Number));
    expect(logOutput).toBe('output');
  });

});
