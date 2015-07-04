'use strict';
describe('byErrorAndWarningStacked', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byErrorAndWarningStacked = require('../byErrorAndWarningStacked');

  it('should receive results and pass them to methods', function() {
    spyOn(statsUtil, 'getStats').and.returnValue('intermediate');
    spyOn(displayUtil, 'getStackedOutput').and.returnValue('output');
    var logOutput = byErrorAndWarningStacked('initial');
    expect(statsUtil.getStats).toHaveBeenCalledWith('initial');
    expect(displayUtil.getStackedOutput).toHaveBeenCalledWith('intermediate');
    expect(logOutput).toBe('output');
  });

});
