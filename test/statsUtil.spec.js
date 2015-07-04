'use strict';
var _ = require('lodash');

describe('statsUtils', function () {
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
    },
    {
      filePath: 'path3',
      messages: [
        {
          ruleId: 'id1',
          severity: 1
        }
      ]
    }];

  it('should return an empty object for empty array results', function () {
    expect(statsUtil.getStats([])).toEqual({});
  });

  it('should return an aggregated object by rule, then severity', function () {
    var stats = statsUtil.getStats(eslintResults);
    expect(_.size(stats)).toBe(2);
    expect(stats.id1).toEqual({errors: 2, warnings: 1});
    expect(stats.id2).toEqual({errors: 1});
  });

  it('should accept a second param, severity, which filters the severities', function () {
    var stats = statsUtil.getStats(eslintResults, 2);
    expect(_.size(stats)).toBe(2);
    expect(stats.id1).toEqual({errors: 2});
    expect(stats.id2).toEqual({errors: 1});
  });

  describe('getStatsByFolder', function () {
    var byFolderResults = [{
      filePath: 'path1/file1',
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
        filePath: 'path1/file2',
        messages: [
          {
            ruleId: 'id1',
            severity: 2
          }
        ]
      },
      {
        filePath: 'path3',
        messages: [
          {
            ruleId: 'id1',
            severity: 1
          }
        ]
      }];

    it('should divide the results by folder', function () {
      var stats = statsUtil.getStatsByFolder(byFolderResults);
      var expectedResult = {
        path1: {
          id1: {errors: 2},
          id2: {errors: 1}
        },
        'Base Folder': {
          id1: {warnings: 1}
        }
      };
      expect(stats).toEqual(expectedResult);
    });
  });
});
