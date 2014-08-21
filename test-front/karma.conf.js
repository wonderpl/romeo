module.exports = function(config) {
  'use strict';
  config.set({

    basePath : '../',

    files : [
      'wonder/romeo/static/assets/vendor/js/jquery.js',
      'wonder/romeo/static/assets/vendor/js/angular-file-upload/angular-file-upload-shim.min.js', // Has to be loaded before angular
      'wonder/romeo/static/assets/vendor/js/angular/angular.js',
      'wonder/romeo/static/assets/vendor/js/angular/angular-route.js',
      'wonder/romeo/static/assets/vendor/js/angular/angular-cookies.js',
      'wonder/romeo/static/assets/vendor/js/angular/angular-localstorage.js',
      'wonder/romeo/static/assets/vendor/js/angular/angular-mocks.js',
      'wonder/romeo/static/assets/vendor/js/angular-file-upload/angular-file-upload.min.js',
      'wonder/romeo/static/assets/vendor/js/angulartics-0.16.1/angulartics.min.js',
      'wonder/romeo/static/assets/vendor/js/angulartics-0.16.1/angulartics-ga.min.js',
      'wonder/romeo/static/assets/vendor/js/moment.js',
      'wonder/romeo/static/assets/vendor/js/spectrum.js',
      'wonder/romeo/static/assets/vendor/js/medium-editor.js',

      'wonder/romeo/static/assets/scripts/*.js',
      'wonder/romeo/static/assets/scripts/services/*.js',
      'wonder/romeo/static/assets/scripts/controllers/*.js',
      'wonder/romeo/static/assets/scripts/filters/*.js',
      'wonder/romeo/static/assets/scripts/directives/**/*.js',
      'wonder/romeo/static/assets/vendor/js/angular-medium-editor.js',

      'wonder/romeo/static/assets/app/**/*.js',
      'wonder/romeo/static/assets/common/**/*.js',

      'test-front/mock/**/*.js',
      'test-front/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-htmlfile-reporter'
            ],

    junitReporter : {
      outputFile: 'test-front/out/unit.xml',
      suite: 'unit'
    }

  });
};
