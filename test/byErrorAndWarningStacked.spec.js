'use strict';
describe('byErrorAndWarningStacked', function() {
  const chart = require('../util/chart');
  const stats = require('../util/stats');
  var byErrorAndWarningStacked = require('../byErrorAndWarningStacked');

  it('should receive results and pass them to methods', function() {
    spyOn(stats, 'byRule').and.returnValue('intermediate');
    spyOn(chart, 'getStackedOutput').and.returnValue('output');
    var logOutput = byErrorAndWarningStacked('initial');
    expect(stats.byRule).toHaveBeenCalledWith('initial');
    expect(chart.getStackedOutput).toHaveBeenCalledWith('intermediate', jasmine.any(Number));
    expect(logOutput).toBe('output');
  });

});
