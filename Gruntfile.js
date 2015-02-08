module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ['test/']
    },
    eslint: {
      // options: {
      //   format: require('path').join(__dirname, 'byError.js')
      // },
      all: {
        src: ['*.js', 'test/*.js', 'util/*.js']
      },
      byError: {
        src: ['*.js', 'test/*.js', 'util/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  // Default task(s).
  grunt.registerTask('default', ['eslint:all', 'jasmine_node']);
};
