(function () {

  'use strict';

  function VideoConfigNav ($templateCache) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/edit/video-config-nav.dir.html'),
      scope : true
    };
  }

  angular.module('RomeoApp.video').directive('videoConfigNav', ['$templateCache', VideoConfigNav]);

})();
