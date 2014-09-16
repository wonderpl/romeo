//video-add-collection.js
(function () {
  'use strict';

  function videoAddCollection($templateCache, modal, TagService) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/video-add-collection.tmpl.html'),
      scope : true,
      controller : function ($scope) {
        $scope.saveNewCollection = function () {
          var data = {
            label : $scope.collection.label,
            description : $scope.collection.description,
            public : ($scope.collection.scope === 'public')
          };

          TagService.createTag(data).then(function (res) {
            res = res.data || res;

            angular.extend(data, res);
            $scope.tags.push(data);
            $scope.video.tags.items.push(data);
            $scope.close();
          });
        };

        $scope.hideAddRemoveAndShowCreateCollection = function () {
          $scope.addVideoToCollection = true;
          $scope.collection = {};
          $scope.collection.scope = 'private';
          $scope.showOnlyPrivate = true;
          modal.load('modal-create-new-collection.html', true, $scope, {});
        };

        $scope.getTitle = function() {
          if (!$scope.video || !$scope.video.tags || !$scope.video.tags.items || $scope.video.tags.items.length === 0)
            return 'Add video to collection';
          else if ($scope.video.tags.items.length === 1)
            return 'In Collection:';
          return 'In Collections:';
        };

        $scope.close = function () {
          // $scope.addVideoToCollection = false;
          modal.hide();
        };

        $scope.removeTag = function (id, $event) {
          $event.stopPropagation();
          for (var i = 0; i < $scope.video.tags.items.length; ++i) {
            if ($scope.video.tags.items[i].id === id) {
              $scope.video.tags.items.splice(i, 1);
              break;
            }
          }
        };

        $scope.addTag = function (id, $event) {
          $event.stopPropagation();
          for (var i = 0; i < $scope.tags.length; ++i) {
            if ($scope.tags[i].id === id) {
              $scope.video.tags.items.push($scope.tags[i]);
              break;
            }
          }
        };

        $scope.hasTag = function (id) {
          if ($scope.video && $scope.video.tags && $scope.video.tags.items) {
            var tags = $scope.video.tags.items;
            for (var i = 0; i < tags.length; ++i) {
              if (tags[i].id === id) {
                return true;
              }
            }
          }
          return false;
        };

        $scope.hasTagLabel = function (label) {
          var tags = $scope.tags || [];
          var l = tags.length;
          while (l--) {
            if (tags[l].label == label) {
              return true;
            }
          }
          return false;
        };
      }
    };
  }

  angular.module('RomeoApp.video')
    .directive('videoAddCollection', ['$templateCache', 'modal', 'TagService', videoAddCollection]);
})();