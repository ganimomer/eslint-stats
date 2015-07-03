'use strict';
describe('byErrorAndWarning', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byErrorAndWarning = require('../byErrorAndWarning');

  it('should receive results and pass them to methods', function() {
    spyOn(statsUtil, 'getReportObjArray').and.returnValue('intermediate');
    spyOn(displayUtil, 'getObjectOutput').and.returnValue('output');
    var logOutput = byErrorAndWarning('initial');
    expect(statsUtil.getReportObjArray).toHaveBeenCalledWith('initial');
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith('intermediate');
    expect(logOutput).toBe('output');
  });

});
