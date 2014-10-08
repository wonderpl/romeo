module.exports = function(config) {
  'use strict';
  config.set({

    basePath : '../',

    files : [
      'wonder/romeo/static/bower/jquery/dist/jquery.js',
      'wonder/romeo/static/bower/ng-file-upload/angular-file-upload-shim.min.js', // Has to be loaded before angular
      'wonder/romeo/static/bower/angular/angular.js',
      'wonder/romeo/static/bower/angular-route/angular-route.js',
      'wonder/romeo/static/bower/angular-cookies/angular-cookies.js',
      'wonder/romeo/static/bower/angular-sanitize/angular-sanitize.js',
      'wonder/romeo/static/bower/angular-local-storage/angular-local-storage.js',
      'wonder/romeo/static/bower/angular-mocks/angular-mocks.js',
      'wonder/romeo/static/bower/ng-file-upload/angular-file-upload.min.js',
      'wonder/romeo/static/bower/angulartics/src/angulartics.js',
      'wonder/romeo/static/bower/angulartics/src/angulartics-ga.js',
      'wonder/romeo/static/bower/moment/moment.js',
      'wonder/romeo/static/bower/spectrum/spectrum.js',
      'wonder/romeo/static/bower/medium-editor/dist/js/medium-editor.js',
      'wonder/romeo/static/bower/angular-medium-editor/dist/angular-medium-editor.js',
      'wonder/romeo/static/bower/angular-ui-select2/src/select2.js',
      // 'wonder/romeo/static/bower/d3/d3.js',
      // 'wonder/romeo/static/bower/nvd3/nv.d3.js',
      // 'wonder/romeo/static/bower/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',

      'wonder/romeo/static/assets/scripts/helpers.js',
      'wonder/romeo/static/assets/scripts/app.js',
      'wonder/romeo/static/gen/romeo/views.js',

      'wonder/romeo/static/assets/vendor/js/angular-medium-editor.js',

      'wonder/romeo/static/assets/app/**/*.js',
      'wonder/romeo/static/assets/common/**/*.js',

      'test-front/mock-modules.js',
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
