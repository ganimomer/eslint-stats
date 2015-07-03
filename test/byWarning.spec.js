'use strict';
describe('byWarning', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byWarning = require('../byWarning');

  it('should receive results and pass them to methods', function() {
    spyOn(statsUtil, 'getReportObjArray').and.returnValue([{ruleCount: {'semi': 1}, severity: 1}]);
    spyOn(displayUtil, 'getObjectOutput').and.returnValue('output');
    var logOutput = byWarning('initial');
    expect(statsUtil.getReportObjArray).toHaveBeenCalledWith('initial');
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith([{ruleCount: {'semi': 1}, severity: 1}]);
    expect(logOutput).toBe('output');
  });

});
