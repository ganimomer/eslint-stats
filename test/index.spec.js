'use strict';
describe('index', function() {

  it('should return this path, followed by "byError"', function() {
    var endpoint = require('../index');
    expect(endpoint.byError).toEqual(process.cwd() + '/byError.js');
  });
});
