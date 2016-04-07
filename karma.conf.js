'use strict'

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha'],

    files: [
      { pattern: './config/spec-bundle.js', watched: false },
    ],

    exclude: [ ],

    plugins: [
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-webpack'),
    ],

    browserNoActivityTimeout: 0,

    preprocessors: {
      'config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'],
    },

    webpack: require('./webpack.config.test'),

    // Webpack please don't spam the console when running in karma!
    webpackServer: { noInfo: true },

    client: {
      mocha: {
        bail: true,
      },
    },

    // test results reporter to use
    // possible values: dots || progress || nested || junit
    // use just 'spec' if you need to see the names of specs to be printed out,
    // sometimes useful to find out where warnigns are thrown.
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'text-summary' },
        { type: 'json' },
        { type: 'html' },
      ],
    },

    // web server port
    port: 9876,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
    autoWatchBatchDelay: 250,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari
    // - PhantomJS
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
  })
}
