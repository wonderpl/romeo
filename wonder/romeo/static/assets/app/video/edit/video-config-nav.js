(function () {

  'use strict';

  function VideoConfigNav ($templateCache) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/edit/video-config-nav.dir.html'),
      scope : {
        showModal : '=',
        modalSelection : '='
      },
      controller : function ($scope) {

        $scope.showSection = function (section) {
          $scope.showModal = true;
          $scope.modalSelection = section;
        };
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoConfigNav', ['$templateCache', VideoConfigNav]);

})();
