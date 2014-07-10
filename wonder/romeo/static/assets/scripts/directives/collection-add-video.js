angular.module('RomeoApp.directives')
  .directive('collectionAddVideo', ['$templateCache', 'VideoService', '$q', '$location', function ($templateCache, VideoService, $q, $location) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('collection-add-video.html'),
    scope : {
      availableTags : '=',
      assignedTags : '=',
      showCollection : '='
    },
    link : function (scope, elem, attrs) {
      console.log(scope.availableTags);


    },
    controller : function ($scope) {

      function getVideo () {
        var dfd = new $q.defer();
        $scope.video = $scope.video || {};
        if ($scope.video && $scope.video.id) {
          dfd.resolve($scope.video);
        } else {
          $scope.video.title = "New Video";
          VideoService.create($scope.video).then(function (data) {

            angular.extend($scope.video, data);

            // this should be done with a watch
            var url = '/video/' + $scope.video.id;
            $location.path(url, false);

            dfd.resolve(data);
          });
        }
        return dfd.promise;
      }

      $scope.removeTag = function (id) {

        // /api/video/<video_id>/tags/<tag_id>


      };

      $scope.hasTag = function (tagId) {
        $scope.assignedTags = $scope.assignedTags || [];
        var l = $scope.assignedTags.length;
        var tags = $scope.assignedTags;
        var hasTag = false;

        while (l--) {
          if (tags[l].id === tagId) {
            hasTag = true;
          }
        }

        return hasTag;
      };

      $scope.addTag = function (id, $event) {

        console.log(id);

        var label = $($event.currentTarget).find('.video-edit-collections__option-title').text();

        getVideo().then(function (video) {

          angular.extend($scope.video, video);

          VideoService.addToCollection(video.id, id).then(function (data) {

            // { "href": "/api/video/51668773/tags/3" }

            console.log($scope.video);

            console.log(data);

            if (data && data.href) {

              $scope.assignedTags = $scope.assignedTags || [];

              $scope.assignedTags.push({
                id    : id,
                href  : data.href,
                label : label
              });

              // update class

            } else {

              // video already has tag
            }

          }, function (response) {

            console.log(response);

          });
        });
      };
    }
  };
}]);