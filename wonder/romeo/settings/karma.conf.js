module.exports = function(config){
    config.set({

    files : [
      'wonder/romeo/static/assets/vendor/js/angular/angular.js',
      'wonder/romeo/static/assets/scripts/**/*.js',
      'test/unit/**/*.js'
    ],

    exclude : ['wonder/romeo/static/assets/scripts/prod/**/*.js'],
    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['PhantomJS', 'Chrome'],
    logLevel: config.LOG_DEBUG,

    plugins : [
        'karma-phantomjs-launcher',
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-htmlfile-reporter'
    ]
})}