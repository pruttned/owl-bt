// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'src/client/bower_components/jquery/dist/jquery.js',
      'src/client/bower_components/angular/angular.js',
      'src/client/bower_components/angular-mocks/angular-mocks.js',
      'src/client/bower_components/angular-resource/angular-resource.js',
      'src/client/bower_components/angular-cookies/angular-cookies.js',
      'src/client/bower_components/angular-sanitize/angular-sanitize.js',
      'src/client/bower_components/angular-route/angular-route.js',
      'src/client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'src/client/bower_components/lodash/dist/lodash.min.js',
      'src/client/bower_components/undo-manager/lib/undomanager.js',
      'src/client/bower_components/angular-hotkeys/build/hotkeys.js',
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/string_score/string_score.js',
      'src/client/app/app.js',
      'src/client/app/**/*.js',
      'src/client/components/**/*.js',
      'src/client/app/**/*.html',
      'src/client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'ng-html2js',
      'src/client/components/**/*.js': 'babel',
      'src/client/app/**/*.js': 'babel',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/client/'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'src/client/'
    },


    babelPreprocessor: {
      options: {
		presets: ['es2015'],
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    //captureConsole: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
