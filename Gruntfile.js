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
      app: {
        src: [
          'scripts/*.js'
        ],
        dest: 'pub/js/game.min.js'
      }
    },

    uglify: {
      vendor: {
        src: 'pub/js/vendor.min.js',
        dest: 'pub/js/vendor.min.js'
      },
      app: {
        src: 'pub/js/game.min.js',
        dest: 'pub/js/game.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['scripts/*.js'],
        // tasks: ['concat', 'uglify'],
        tasks: ['concat'],
        options: {
          spawn: false,
        }
      },

      styles: {
        files: ['sass/*.scss'],
        tasks: ['compass'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // grunt.registerTask('default', ['compass', 'concat', 'uglify']);
  grunt.registerTask('default', ['compass', 'concat']);
};