'use strict';
describe('byError', function () {
  var chart = require('../util/chart');
  var stats = require('../util/stats');
  var byError = require('../byError');

  it('should receive results and pass them to methods', function () {
    spyOn(stats, 'byRule').and.returnValue({semi: {errors: 2}});
    spyOn(chart, 'getObjectOutput').and.returnValue('output');
    var logOutput = byError('initial');
    expect(stats.byRule).toHaveBeenCalledWith('initial', 2);
    expect(chart.getObjectOutput).toHaveBeenCalledWith({semi: {errors: 2}}, jasmine.any(Number));
    expect(logOutput).toBe('output');
  });

});
