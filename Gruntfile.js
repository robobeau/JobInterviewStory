module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      app: {
        options: {
          paths: ['styles']
        },
        files: {
          'pub/css/game.css': 'styles/*.less'
        }
      }
    },

    concat: {
      vendor: {
        src: [
          'node_modules/jquery/dist/jquery.min.js'
        ],
        dest: 'pub/js/vendor.min.js'
      }
    },

    connect: {
      pub: {
        options: {
          base: 'pub',
          open: true,
          useAvailablePort: true
        }
      }
    },

    ts: {
      app: {
        src: [
          'scripts/*.ts'
        ],
        dest: 'pub/js/game.min.js',
        options: {
          sourceMap: true,
          sourceRoot: 'scripts'
        }
      }
    },

    uglify: {
      app: {
        src: 'pub/js/game.min.js',
        dest: 'pub/js/game.min.js',
        options: {
          sourceMapRoot: '../../scripts'
        }
      }
    },

    watch: {
      scripts: {
        files: ['scripts/*.ts'],
        tasks: ['ts'],
        options: {
          livereload: true,
          spawn: false
        }
      },

      styles: {
        files: ['styles/*.less'],
        tasks: ['less'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', ['less', 'concat', 'ts', 'uglify', 'connect', 'watch']);
};
