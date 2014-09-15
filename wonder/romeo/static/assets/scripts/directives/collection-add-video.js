angular.module('RomeoApp.directives')
  .directive('collectionAddVideo', ['$templateCache', 'VideoService', '$q', '$location', 'TagService', 'modal', '$route',
  function ($templateCache, VideoService, $q, $location, TagService, modal, $route) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('collection-add-video.html'),
    scope : {
      availableTags : '=',
      video : '=',
      showCollection : '=',
    },
    link : function (scope, elem, attrs) {



    },
    controller : function ($scope) {

      // this should be moved to controller
      function getVideo () {
        var dfd = new $q.defer();
        if ($scope.video && $scope.video.id) {
          VideoService.get($scope.video.id).then(function (data) {
            angular.extend($scope.video, data);
            dfd.resolve($scope.video);
          });
        } else {
          $scope.video = $scope.video || {};
          $scope.video.title = $scope.video.title || 'New Video';
          VideoService.create($scope.video).then(function (data) {
            angular.extend($scope.video, data);
            var url = '/video/' + $scope.video.id;
            $location.path(url, false);
            dfd.resolve($scope.video);
          });
        }
        return dfd.promise;
      }

      $scope.removeTag = function (id, $event) {
        $event.stopPropagation();
        VideoService.removeFromCollection($scope.video.id, id).then(function () {
          VideoService.get($scope.video.id).then(function (data) {
            angular.extend($scope.video, data);
          });
        });
      };

      $scope.hasTag = function (tagId) {
        return VideoService.hasTag(tagId, $scope.video);
      };

      $scope.addTag = function (id, $event) {

        getVideo().then(function (data) {
          VideoService.addToCollection($scope.video.id, id).then(function () {
            getVideo();
          });
        });
      };

      $scope.getTitle = function() {
        if (!$scope.video || !$scope.video.tags || !$scope.video.tags.items || $scope.video.tags.items.length === 0)
          return 'Add video to collection';
        else if ($scope.video.tags.items.length === 1)
          return 'In Collection:';
        return 'In Collections:';
      };

      $scope.saveNewCollection = function () {

        var label = $scope.collection.label;
        var description = $scope.collection.description;
        var isPublic = $scope.collection.scope === 'public';

        var data = {
          label : label,
          description : description,
          public : isPublic
        };

        TagService.createTag(data).then(function () {
          TagService.getTags().then(function (data) {
            $scope.availableTags = data.tag.items;
            $scope.tags = data.tag.items;
            var tag = getTagByLabel(label);

            if (tag && $scope.addVideoToCollection) {
              $scope.addTag(tag.id);
            }
            $scope.addVideoToCollection = false;
            modal.hide();
            $route.reload();
          });
        });
      };

      $scope.close = function () {
        $scope.addVideoToCollection = false;
        modal.hide();
      };

      $scope.hideAddRemoveAndShowCreateCollection = function () {
        $scope.addVideoToCollection = true;
        $scope.collection = {};
        $scope.collection.scope = 'private';
        $scope.showOnlyPrivate = true;
        modal.load('modal-create-new-collection.html', true, $scope, {});
      };

      $scope.hasTagLabel = function (label) {
        return (getTagByLabel(label) !== null);
      };

      $scope.showHideCollectionCtrl = function() {
        $scope.$emit('show-hide-collection');
      };

      function getTagByLabel (label) {
        var tag = null;
        var tags = $scope.tags || [];
        var l = tags.length;
        while (l--) {
          if (tags[l].label == label) {
            tag = tags[l];
            break;
          }
        }
        return tag;
      }
    }
  };
}]);