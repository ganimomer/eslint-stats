'use strict';
var _ = require('lodash');

describe('statsUtils', function() {
  var statsUtil = require('../util/statsUtil');
  var eslintResults = [{
    filePath: 'path1',
    messages: [
      {
        ruleId: 'id1',
        severity: 2
      },
      {
        ruleId: 'id2',
        severity: 2
      }
    ]
  },
  {
    filePath: 'path2',
    messages: [
      {
        ruleId: 'id1',
        severity: 2
      }
    ]
  }
  ];

  it('should return an empty object for empty array results', function() {
    expect(statsUtil.getReportObjArray([])).toEqual({});
  });

  it('should return an aggregated error object', function() {
    var errorObjArr = statsUtil.getReportObjArray(eslintResults);
    expect(Object.keys(errorObjArr).length).toBe(2);
    expect(_(errorObjArr).pluck('ruleCount').filter('id1').value()[0].id1).toBe(2);
    expect(_(errorObjArr).pluck('ruleCount').filter('id2').value()[0].id2).toBe(1);
  });

  it('should aggregate warnings', function() {
    var warningResult = {
      filePath: 'path3',
      messages: [
        {
          ruleId: 'id1',
          severity: 1
        }
      ]
    };
    var resultsWithWarning = _.union(eslintResults, [warningResult]);
    var errorObjArr = statsUtil.getReportObjArray(resultsWithWarning);
    expect(Object.keys(errorObjArr).length).toBe(3);
    expect(_(errorObjArr).filter({severity: 1}).pluck('ruleCount').value()[0].id1).toBe(1);
    expect(_(errorObjArr).pluck('ruleCount').filter('id2').value()[0].id2).toBe(1);
  });
});
