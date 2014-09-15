module.exports = function (grunt) {


    /* Grunt config */
    /* ============ */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* Linting! */
        /* ======== */
        jshint: {
            options: {
                jshintrc: true
            },
            files: [
                'wonder/romeo/static/assets/scripts/**/*.js',
                'wonder/romeo/static/assets/common/**/*.js',
                'wonder/romeo/static/assets/app/**/*.js'
            ]
        },

        /* Clean Files! */
        /* ======== */
        clean: {
            dist: {
                src: ['dist']
            }
        },

        /* Copy Files! */
        /* ======== */
        copy: {
            // css: {
            //     src: 'wonder/romeo/static/assets/css/app.css',
            //     dest: 'dist/assets/css/app.css'
            // },
            fonts: {
                files: [
                    {
                        expand: true,
                        src: 'assets/fonts/*',
                        dest: 'dist/',
                        filter: 'isFile',
                        cwd: 'wonder/romeo/static/'
                    }
                ]
            },
            img: {
                files: [
                    {
                        expand: true,
                        src: 'assets/img/*',
                        dest: 'dist/',
                        filter: 'isFile',
                        cwd: 'wonder/romeo/static/'
                    }
                ]
            },
            bowerfiles: {
                files: [
                    {
                        expand: true,
                        src: [
                            '*.png',
                            '*.gif',
                        ],
                        dest: 'static/gen/',
                        filter: 'isFile',
                        cwd: 'wonder/romeo/static/bower/select2/'
                    },
                    {
                        expand: true,
                        src: '/*.swf', // Where does this need to go?
                        dest: 'static/gen/',
                        filter: 'isFile',
                        cwd: 'wonder/romeo/static/bower/ng-file-upload/'
                    },
                    {
                        expand: true,
                        src: '*',
                        dest: 'static/gen/images/',
                        filter: 'isFile',
                        cwd: 'wonder/romeo/static/bower/jquery.ui/themes/base/images/'
                    }
                ]
            },
            json: {
                files: [
                    {
                        expand: true,
                        src: 'api/*',
                        dest: 'dist/',
                        filter: 'isFile',
                        cwd: 'wonder/romeo/static/'
                    }
                ]
            }
        },

        /* Concatenation! */
        /* ============== */
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: ['wonder/romeo/static/assets/scripts/**/*.js', 'wonder/romeo/static/assets/common/**/*.js', 'wonder/romeo/static/assets/app/**/*.js'],
                dest: 'dist/assets/scripts/app.js'
            },
            vendor: {
                src: ['wonder/romeo/static/assets/vendor/js/angular/angular.js', 'wonder/romeo/static/assets/vendor/**/*.js', '!wonder/romeo/static/assets/vendor/**/*.min.js'],
                dest: 'dist/assets/scripts/vendor.js'
            }
        },

        /* JS Minification! */
        /* ============= */
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/assets/scripts/app.min.js': ['<%= concat.dist.dest %>']
                }
            },
            vendor: {
                files: {
                    'dist/assets/scripts/vendor.min.js': ['<%= concat.vendor.dest %>']
                }
            },
            views: {
                files: {
                    'dist/assets/scripts/views.min.js': 'wonder/romeo/static/assets/scripts/views.js'
                }
            }
        },

        /* CSS Minification! */
        /* ============= */
        cssmin: {
            dist: {
                files: {
                    'dist/assets/css/app.min.css': ['dist/assets/css/app.css']
                }
            }
        },

        processhtml: {
            dist: {
                files: {
                    'dist/index.html': ['wonder/romeo/static/index.html']
                }
            }
        },

        /* Unit testing */
        /* ============ */
        karma: {
            raw: {
                configFile: 'test-front/karma.conf.js',
                options: {
                    browsers: ['PhantomJS'],
                    singleRun: true,
                    reporters: ['dots'],
                    logLevel: 'ERROR'
                }
            },
            built: {
                configFile: 'karma.conf.js',
                options: {
                    singleRun: true,
                    browsers: ['PhantomJS']
                }
            }
        },

        /* Compass configuration! */
        /* ====================== */
        compass: {
            dist: {
                options: {
                    sassDir: 'wonder/romeo/static/scss',
                    cssDir: 'wonder/romeo/static/assets/css',
                    config: 'wonder/romeo/settings/config.rb'
                }
            },
            prod: {
                options: {
                    sassDir: 'wonder/romeo/static/scss',
                    cssDir: 'wonder/romeo/static/assets/css',
                    config: 'wonder/romeo/settings/config.rb',
                    outputStyle: 'compressed'
                }
            }
        },

        /* Angular template compilation! */
        /* ============================= */
        ngtemplates: {
            options: {
                url: function (url) {
                    if (url.indexOf('wonder/romeo/static/assets/app/') > -1) {
                        return url.replace('wonder/romeo/static/assets/app/', '');
                    }
                    else if (url.indexOf('wonder/romeo/static/assets/common/') > -1) {
                        return url.replace('wonder/romeo/static/assets/common/', '');
                    }
                    var name;
                    name = url.split('/');
                    return name[name.length - 1];
                },
                bootstrap: function (module, script) {
                    return "angular.module('RomeoApp').run(['$templateCache', function($templateCache) { " + script.replace(/\{\{/gi, '(~').replace(/\}\}/gi, '~)') + "} ]);";
                }
            },
            RomeoApp: {
                module: 'RomeoApp',
                src: ['wonder/romeo/static/views/**/*.html', 'wonder/romeo/static/assets/app/**/*.tmpl.html', 'wonder/romeo/static/assets/common/**/*.tmpl.html'],
                dest: 'wonder/romeo/static/assets/scripts/views.js'
            }
        },

        /* Watch task!
         /* ========================= */
        watch: {
            sass: {
                files: [
                  'wonder/romeo/static/scss/**/*.scss',
                  'wonder/romeo/static/assets/common/**/*.scss',
                  'wonder/romeo/static/assets/app/**/*.scss'
                ],
                tasks: ['compass:dist']
            },
            angular: {
                files: [
                  'wonder/romeo/static/views/**/*.html',
                  'wonder/romeo/static/assets/app/**/*.tmpl.html',
                  'wonder/romeo/static/assets/common/**/*.tmpl.html'
                ],
                tasks: ['ngtemplates']
            },
            jshint: {
                files: [
                    'wonder/romeo/static/assets/scripts/**/*.js',
                    'wonder/romeo/static/assets/common/**/*.js',
                    'wonder/romeo/static/assets/app/**/*.js'
                ],
                tasks: ['jshint']
            }, // @TODO enable karma unit tests as part of watch
            unittest: {
                files: [
                    'wonder/romeo/static/assets/scripts/**/*.js',
                    'wonder/romeo/static/assets/common/**/*.js',
                    'wonder/romeo/static/assets/app/**/*.js',
                    'test-front/unit/**/*.js'
                ],
                tasks: ['karma:raw']
            }
        }
    });

    /* Register the tasks we want grunt to actually use
     /* ========================= */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-processhtml');

    /* TASK ALIASES */
    grunt.registerTask('build', [ 'clean', 'ngtemplates', 'jshint', 'compass:dist', 'copy', 'concat', 'uglify', 'processhtml', 'karma:raw' ]);
    grunt.registerTask('templates', [ 'ngtemplates' ]);

    /* Running GRUNT without any parameters will run the following tasks
     /* ========================= */
    grunt.registerTask('default', [ 'build' ]);

};