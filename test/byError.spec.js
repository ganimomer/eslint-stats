'use strict';
describe('byError', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byError = require('../byError');

  it('should recieve results and pass them to methods', function() {
    spyOn(statsUtil, 'getReportObjArray').andReturn([{ruleCount: {'semi': 1}, severity: 2}]);
    spyOn(displayUtil, 'getObjectOutput').andReturn('output');
    var logOutput = byError('initial');
    expect(statsUtil.getReportObjArray).toHaveBeenCalledWith('initial');
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith([{ruleCount: {'semi': 1}, severity: 2}]);
    expect(logOutput).toBe('output');
  });

});
