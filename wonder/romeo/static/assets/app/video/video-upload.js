angular.module('RomeoApp.directives')
  .directive('videoUpload', ['$templateCache', '$upload', function ($templateCache, $upload) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/video-upload.dir.html')
  };
}]);