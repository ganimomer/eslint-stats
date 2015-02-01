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
      all: {
        src: ['*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  // Default task(s).
  grunt.registerTask('default', ['eslint:all', 'jasmine_node']);
};
