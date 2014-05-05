module.exports = function(grunt) {

  var iscroll = [
    'lib/iscroll/src/iscroll.js'
  ];

  var iscrollPath = 'src/osmplayer.iscroll.js';

  var files = [
    'src/osmplayer.js',
    'src/osmplayer.parser.default.js',
    'src/osmplayer.parser.youtube.js',
    'src/osmplayer.parser.rss.js',
    'src/osmplayer.parser.asx.js',
    'src/osmplayer.parser.xspf.js',
    'src/osmplayer.playlist.js',
    'src/osmplayer.pager.js',
    'src/osmplayer.teaser.js'
  ];

  var template = [
    'templates/default/js/osmplayer.playLoader.default.js',
    'templates/default/js/osmplayer.controller.default.js',
    'templates/default/js/osmplayer.playlist.default.js',
    'templates/default/js/osmplayer.teaser.default.js',
    'templates/default/js/osmplayer.pager.default.js',
    'templates/default/js/osmplayer.default.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js'].concat(files).concat(template)
    },
    concat: {
      options: {
        separator: '',
      },
      screenfull: {
        options: {
          banner: "var osmplayer = osmplayer || {};\n(function(exports) {",
          footer: "\n})(osmplayer);"
        },
        files: {
          'src/osmplayer.iscroll.js': iscroll
        }
      },
      build: {
        files: {
          'bin/osmplayer.js': ['minplayer/bin/minplayer.js', iscrollPath].concat(files)
        }
      }
    },
    uglify: {
      options: {
        banner: ''
      },
      build: {
        files: {
          'bin/osmplayer.compressed.js': ['bin/osmplayer.js'],
          'bin/osmplayer.min.js': ['bin/osmplayer.js'],
          'templates/default/osmplayer.default.js': template
        }
      }
    },
    jsdoc : {
      dist : {
        src: files,
        options: {
          template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          destination: 'doc'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'jsdoc']);
};
