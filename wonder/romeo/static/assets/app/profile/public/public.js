
angular
  .module('RomeoApp.profile')
  .directive('profilePublic', ['$templateCache', 'AccountService',
function ($templateCache, AccountService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/public/public.tmpl.html'),
    scope : true,
    controller : function ($scope) {
      $scope.$watch('videos', function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          setDefaultThumbnail(newValue);
        }
      });

      function getThumbnail(video) {
        var thumbs;
        if (angular.isDefined(video.thumbnails) && angular.isDefined(video.thumbnails.items) ) {
          thumbs = video.thumbnails.items;
          for (var i = 0; i < thumbs.length; ++i) {
            if (thumbs[i].height == 180) {
              return thumbs[i].url;
            }
          }
        }
        return '';
      }
      function setDefaultThumbnail(videos) {
        angular.forEach(videos, function (video, key) {
          video.thumbnail = getThumbnail(video);
        });
      }
      setDefaultThumbnail($scope.videos);
    }
  };
}
]);
