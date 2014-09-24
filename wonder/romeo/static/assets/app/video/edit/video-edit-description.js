(function () {

  'use strict';

  function editDescription ($templateCache, VideoService) {

    var $frame;

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/edit/video-edit-description.dir.html'),
      scope: {
        video: '='
      },
      link : function (scope, elem, attrs) {



      },
      controller : function ($scope) {
        $scope.$watch('video.description', function (newValue, oldValue) {
          // Update player frame
          if (newValue !== oldValue) {
            var frame = $('.video-player__frame')[0].contentDocument || $('.video-player__frame')[0].contentWindow.document;
            frame.dispatchEvent(new CustomEvent('video-data-change', { detail : { path : 'video.description', data : newValue }}));
          }
        });
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoEditDescription', ['$templateCache', 'VideoService', editDescription]);

})();