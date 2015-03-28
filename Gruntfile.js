module.exports = function (grunt) {

    'use strict';

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {

            client: {
                options: {
                    jshintrc: true
                },
                src: ['js/**/*.js']
            }

        },

        watch: {

            default: {
                files: ['js/**/*.js'],
                tasks: ['jshint']
            }

        }

    });

    grunt.registerTask('default', [ 'jshint' ]);

};
