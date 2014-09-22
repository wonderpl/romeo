(function () {

  'use strict';

  function editDescription ($templateCache, VideoService) {

    var $frame;

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/video-edit-description.dir.html'),
      scope: {
        video: '='
      },
      link : function (scope, elem, attrs) {



      },
      controller : function ($scope) {


      }
    };
  }

  angular.module('RomeoApp.video').directive('videoEditDescription', ['$templateCache', 'VideoService', editDescription]);

})();