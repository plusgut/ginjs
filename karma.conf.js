/* globals module */

// Karma configuration
// Generated on Fri May 13 2016 20:43:12 GMT+0200 (CEST)

module.exports = function (config) {
  var files = [
    'index.ts',
    'src/**/*.ts',
    'test/**/*.spec.ts',
    'test/**/*.spec.tsx',
    'node_modules/redchain/index.ts',
  ];

  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],

    // list of files / patterns to load in the browser
    files: files,

    include: files,

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      'test/**/*.spec.ts': ['karma-typescript'],
      'test/**/*.spec.tsx': ['karma-typescript'],
      'node_modules/redchain/index.ts': ['karma-typescript'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'karma-typescript'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    karmaTypescriptConfig: {
      include: files,
      exclude: [],
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        sourceMap: true,
        module: 'commonjs',
      },
      reports: {
        lcovonly: {
          directory: 'test/coverage/',
          filename: 'lcov.info',
        },
        text: ""
      },
      coverageOptions: {
        exclude: [
          /node_modules/,
          /src\/interfaces/,
          /test/,
        ]
      }
    },
    coverageReporter: {
      dir: ['test/coverage/'],
      instrumenterOptions: {
        istanbul: { noCompact: true },
      },
    },
  };

  config.set(configuration);
};
