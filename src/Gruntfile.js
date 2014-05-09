/*global module:false*/
module.exports = function(grunt) {

    //timing
    require('time-grunt')(grunt);

    //handles plugins
    require('jit-grunt')(grunt); 

    // Project configuration.
    grunt.initConfig({

        // Task configuration.
        excludedFiles: ['!node_modules/**', '!build/**', '!Gruntfile.js', '!package.json', '!README','!.git','!.git/**'],

        clean: {
            build: ['build/'],
        },

        copy: {

            static: {
                files: [
                    {expand: true, cwd: 'static/', src: ['**'], dest: '../', dot:true},
                ]
            },

            ghpage: {
                files: [
                    {expand: true, cwd: 'build/', src: ['**'], dest: '../', dot:true},
                ]
            }

        },

        preprocess: {


            html: {
                files: [
                    {expand: true, cwd: 'pages/', src: ['**/*.html'], dest: 'build/'},
                ],
                options: {
                    context : {
                        debug: true,
                        development: true
                    }
                }
            },

            js: {
                files: [
                    {src: 'js/main.js', dest: 'build/js/main.js'},
                ],
                options: {
                    context : {
                        debug: true,
                        DEBUG: true,
                        development: true
                    }
                }
            },

            production: {
                files: [
                    {expand: true, cwd: 'pages/', src: ['**/*.html'], dest: 'build/'},
                    {src: 'js/main.js', dest: 'build/js/main.js'},
                ],
                options: {
                    context : {
                        production: true,
                        PRODUCTION: true
                    }
                }
            },

        },


        stylus: {
            development:
                {
                files: {
                    'build/css/styles.css': 'css/styles.styl'
                }
            },

            production: {
                options: {
                    yuicompress: true
                },
                files: {
                    'build/css/styles.css': 'css/styles.styl'
                }
            }
        },

        csso: {
            production: {
                report: 'min',
                files: {'build/css/styles.css': ['build/css/styles.css']}
            }
        },

        uglify: {
            production: {
                files: {
                    'build/js/main.js': ['build/js/main.js'],
                }
            }
        },

        clean: {

            build: ['build/']

        },

        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ['pages/**/*.html', 'templates/**/*.html'],
                tasks: ['preprocess:html', 'copy:ghpage']
            },
            stylus: {
                files: ['css/**/*.styl'],
                tasks: ['stylus:development', 'copy:ghpage']
            },
            js: {
                files: ['js/**/*.js'],
                tasks: ['preprocess:js', 'copy:ghpage']
            },
            static: {
                files: ['static/**/*'],
                tasks: ['copy']
            }
        }
    });


    grunt.registerTask('preprocess:development', ['preprocess:js', 'preprocess:html']);

    grunt.registerTask('dev', ['clean', 'preprocess:development', 'copy:static', 'stylus:development', 'copy:ghpage', 'clean']);

    grunt.registerTask('debug', ['default', 'watch']);

    grunt.registerTask('default', ['dev']);

    // Staging is production preprocessing without minifiaction/obfuscation
    grunt.registerTask('staging', ['preprocess:production', 'copy:static', 'stylus:production', 'copy:ghpage', 'clean']);

    // production environment
    grunt.registerTask('production', ['clean', 'preprocess:production', 'uglify', 'copy:static', 'stylus:production', 'csso:production', 'copy:ghpage', 'clean']);

};

















