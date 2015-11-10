module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },

    concat: {
      vendor: {
        src: [
          'node_modules/jquery/dist/jquery.min.js'
        ],
        dest: 'pub/js/vendor.min.js'
      },
      // app: {
      //   src: [
      //     'scripts/*.js'
      //   ],
      //   dest: 'pub/js/game.min.js'
      // }
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

    typescript: {
      app: {
        src: [
          'scripts/*.ts'
        ],
        dest: 'pub/js/game.min.js'
      }
    },

    uglify: {
      // vendor: {
      //   src: 'pub/js/vendor.min.js',
      //   dest: 'pub/js/vendor.min.js'
      // },
      app: {
        src: 'pub/js/game.min.js',
        dest: 'pub/js/game.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['scripts/*.ts'],
        tasks: ['typescript'],
        options: {
          livereload: true,
          spawn: false
        }
      },

      styles: {
        files: ['sass/*.scss'],
        tasks: ['compass'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', ['compass', 'concat', 'typescript', 'connect', 'watch']);
};
