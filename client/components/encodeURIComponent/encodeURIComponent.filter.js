'use strict';

angular.module('editorApp')
  .filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
  });
