'use strict';
describe('byErrorAndWarning', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byErrorAndWarning = require('../byErrorAndWarning');

  it('should recieve results and pass them to methods', function() {
    spyOn(statsUtil, 'getReportObjArray').andReturn('intermediate');
    spyOn(displayUtil, 'getObjectOutput').andReturn('output');
    var logOutput = byErrorAndWarning('initial');
    expect(statsUtil.getReportObjArray).toHaveBeenCalledWith('initial');
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith('intermediate');
    expect(logOutput).toBe('output');
  });

});
