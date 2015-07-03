'use strict';
describe('byError', function () {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byError = require('../byError');

  it('should receive results and pass them to methods', function () {
    spyOn(statsUtil, 'getStats').and.returnValue({semi: {errors: 2}});//[{ruleCount: {'semi': 1}, severity: 2}]);
    spyOn(displayUtil, 'getObjectOutput').and.returnValue('output');
    var logOutput = byError('initial');
    expect(statsUtil.getStats).toHaveBeenCalledWith('initial', 2);
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith({semi: {errors: 2}});
    expect(logOutput).toBe('output');
  });

});
