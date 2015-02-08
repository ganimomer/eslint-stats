'use strict';
describe('byError', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byError = require('../byError');

  it('should recieve results and pass them to methods', function() {
    spyOn(statsUtil, 'getErrorObject').andReturn('intermediate');
    spyOn(displayUtil, 'getObjectOutput').andReturn('output');
    var logOutput = byError('initial');
    expect(statsUtil.getErrorObject).toHaveBeenCalledWith('initial');
    expect(displayUtil.getObjectOutput).toHaveBeenCalledWith('intermediate');
    expect(logOutput).toBe('output');
  });

});
