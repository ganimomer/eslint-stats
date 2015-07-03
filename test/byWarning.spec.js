'use strict';
describe('byWarning', function () {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byWarning = require('../byWarning');

  it('should receive results and pass them to methods', function () {
    spyOn(statsUtil, 'getStats').and.returnValue({semi: {warnings: 2}});
    spyOn(displayUtil, 'getObjectOutput').and.returnValue('output');
    var logOutput = byWarning('initial');
    expect(statsUtil.getStats).toHaveBeenCalledWith('initial', 1);
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith({semi: {warnings: 2}});
    expect(logOutput).toBe('output');
  });

});
