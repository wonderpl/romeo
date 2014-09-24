var staticDir = 'wonder/romeo/static',
    assetsDir = staticDir + '/assets',
    outputDir = staticDir + '/gen';

module.exports = function (grunt) {


    /* Grunt config */
    /* ============ */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        staticDir: staticDir,
        assetsDir: assetsDir,
        outputDir: outputDir,

        /* Linting! */
        /* ======== */
        jshint: {
            options: {
                jshintrc: true
            },
            files: [
                '<%= assetsDir %>/scripts/**/*.js',
                '<%= assetsDir %>/common/**/*.js',
                '<%= assetsDir %>/app/**/*.js'
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
            bowerfiles: {
                files: [
                    {
                        expand: true,
                        src: ['*.png', '*.gif'],
                        dest: '<%= outputDir %>/',
                        filter: 'isFile',
                        cwd: '<%= staticDir %>/bower/select2/'
                    },
                    {
                        expand: true,
                        src: '*',
                        dest: '<%= outputDir %>/images/',
                        filter: 'isFile',
                        cwd: '<%= staticDir %>/bower/jquery.ui/themes/base/images/'
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
                src: ['<%= assetsDir %>/scripts/**/*.js', '<%= assetsDir %>/common/**/*.js', '<%= assetsDir %>/app/**/*.js'],
                dest: 'dist/assets/scripts/app.js'
            },
            vendor: {
                src: ['<%= assetsDir %>/vendor/js/angular/angular.js', '<%= assetsDir %>/vendor/**/*.js', '!<%= assetsDir %>/vendor/**/*.min.js'],
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
                    'dist/assets/scripts/views.min.js': '<%= assetsDir %>/scripts/views.js'
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
                    'dist/index.html': ['<%= staticDir %>/index.html']
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
                    sassDir: '<%= staticDir %>/scss',
                    cssDir: '<%= outputDir %>/romeo',
                    config: 'wonder/romeo/settings/config.rb'
                }
            },
            prod: {
                options: {
                    sassDir: '<%= staticDir %>/scss',
                    cssDir: '<%= outputDir %>/romeo',
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
                    if (url.indexOf(assetsDir + '/app/') > -1) {
                        return url.replace(assetsDir + '/app/', '');
                    }
                    else if (url.indexOf(assetsDir + '/common/') > -1) {
                        return url.replace(assetsDir + '/common/', '');
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
                src: [
                    '<%= staticDir %>/views/**/*.html',
                    '<%= assetsDir %>/app/**/*.dir.html',
                    '<%= assetsDir %>/app/**/*.modal.html',
                    '<%= assetsDir %>/app/**/*.tmpl.html',
                    '<%= assetsDir %>/common/**/*.dir.html',
                    '<%= assetsDir %>/common/**/*.modal.html',
                    '<%= assetsDir %>/common/**/*.tmpl.html'
                ],
                dest: '<%= outputDir %>/romeo/views.js'
            }
        },

        /* Watch task!
         /* ========================= */
        watch: {
            sass: {
                files: [
                  '<%= staticDir %>/scss/**/*.scss',
                  '<%= assetsDir %>/common/**/*.scss',
                  '<%= assetsDir %>/app/**/*.scss'
                ],
                tasks: ['compass:dist']
            },
            angular: {
                files: [
                  '<%= staticDir %>/views/**/*.html',
                  '<%= assetsDir %>/app/**/*.dir.html',
                  '<%= assetsDir %>/app/**/*.modal.html',
                  '<%= assetsDir %>/app/**/*.tmpl.html',
                  '<%= assetsDir %>/common/**/*.dir.html',
                  '<%= assetsDir %>/common/**/*.modal.html',
                  '<%= assetsDir %>/common/**/*.tmpl.html'
                ],
                tasks: ['ngtemplates']
            },
            jshint: {
                files: [
                    '<%= assetsDir %>/scripts/**/*.js',
                    '<%= assetsDir %>/common/**/*.js',
                    '<%= assetsDir %>/common/**/**/*.js',
                    '<%= assetsDir %>/app/**/*.js',
                    '<%= assetsDir %>/app/**/**/*.js'
                ],
                tasks: ['jshint']
            },
            unittest: {
                files: [
                    '<%= assetsDir %>/scripts/**/*.js',
                    '<%= assetsDir %>/common/**/*.js',
                    '<%= assetsDir %>/app/**/*.js',
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
    grunt.registerTask('build', [ 'clean', 'ngtemplates', 'jshint', 'compass:dist', 'copy', 'karma:raw' ]);
    grunt.registerTask('templates', [ 'ngtemplates' ]);

    /* Running GRUNT without any parameters will run the following tasks
     /* ========================= */
    grunt.registerTask('default', [ 'build' ]);

};
