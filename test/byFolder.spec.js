'use strict';
describe('byFolder', function() {
  const chart = require('../util/chart');
  const stats = require('../util/stats');
  const byFolder = require('../byFolder');

  it('should receive results and pass them to methods', function() {
    spyOn(stats, 'byFolderAndRule').and.returnValue('intermediate');
    spyOn(chart, 'getOutputByFolder').and.returnValue('output');
    var logOutput = byFolder('initial');
    expect(stats.byFolderAndRule).toHaveBeenCalledWith('initial');
    expect(chart.getOutputByFolder).toHaveBeenCalledWith('intermediate', jasmine.any(Number));
    expect(logOutput).toBe('output');
  });

});
