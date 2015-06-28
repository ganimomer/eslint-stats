'use strict';
describe('byWarning', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byWarning = require('../byWarning');

  it('should recieve results and pass them to methods', function() {
    spyOn(statsUtil, 'getReportObjArray').andReturn([{ruleCount: {'semi': 1}, severity: 1}]);
    spyOn(displayUtil, 'getObjectOutput').andReturn('output');
    var logOutput = byWarning('initial');
    expect(statsUtil.getReportObjArray).toHaveBeenCalledWith('initial');
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith([{ruleCount: {'semi': 1}, severity: 1}]);
    expect(logOutput).toBe('output');
  });

});
