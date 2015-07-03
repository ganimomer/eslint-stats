module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    jasmine: {
      test: {
        src: ['test/*.spec.js']
      }
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
  grunt.loadNpmTasks('grunt-jasmine-npm');

  // Default task(s).
  grunt.registerTask('default', ['eslint:all', 'jasmine']);
};
