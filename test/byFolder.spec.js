'use strict';
describe('byFolder', function() {
  var displayUtil = require('../util/displayUtil');
  var statsUtil = require('../util/statsUtil');
  var byFolder = require('../byFolder');

  it('should receive results and pass them to methods', function() {
    spyOn(statsUtil, 'getStatsByFolder').and.returnValue('intermediate');
    spyOn(displayUtil, 'getOutputByFolder').and.returnValue('output');
    var logOutput = byFolder('initial');
    expect(statsUtil.getStatsByFolder).toHaveBeenCalledWith('initial');
    expect(displayUtil.getOutputByFolder).toHaveBeenCalledWith('intermediate');
    expect(logOutput).toBe('output');
  });

});
