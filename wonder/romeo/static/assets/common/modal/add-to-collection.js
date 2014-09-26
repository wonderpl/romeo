(function () {

  'use strict';

  function AddToCollection ($templateCache, modal, VideoService) {
    function setAvailableTags(scope) {
        if (scope.showOnlyPrivate)
          scope.availableTags = filterPrivateTags(scope.tags);
        else if ($scope.showOnlyPublic)
          scope.availableTags = filterPublicTags(scope.tags);
        else
          scope.availableTags = scope.tags;
    }

    function filterPrivateTags(allTags) {
      var tags = [];
      angular.forEach(allTags, function (val) {
        if (!val.public)
          tags.push(val);
      });
      return tags;
    }

    function filterPublicTags(allTags) {
      var tags = [];
      angular.forEach(allTags, function (val) {
        if (val.public)
          tags.push(val);
      });
      return tags;
    }

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('modal/add-to-collection.modal.html'),
      scope : true,
      controller : function ($scope) {
        $scope.addVideoToCollection =true;

        setAvailableTags($scope);

        $scope.$on('created-new-tag', function () { setAvailableTags($scope); });

        $scope.close = function ($event) {
          modal.hide();
        };
        $scope.hasTag = function (tagId) {
          return VideoService.hasTag(tagId, $scope.video);
        };
        $scope.addTag = function (id) {
          VideoService.addToCollection($scope.video.id, id).then(function () {
            VideoService.get($scope.video.id).then(function (data) {
              angular.extend($scope.video, data);
              $scope.$emit('notify', {
                status : 'success',
                title : 'Collection Updated',
                message : 'Video added to collection.'}
              );
            });
          });
        };
        $scope.removeTag = function (id) {
          VideoService.removeFromCollection($scope.video.id, id).then(function () {
            // Update video in modal
            VideoService.get($scope.video.id).then(function (data) {
              angular.extend($scope.video, data);
              $scope.$emit('notify', {
                status : 'success',
                title : 'Collection Updated',
                message : 'Video removed from collection.'}
              );
            });
          });
        };
      }
    };
  }

  angular.module('RomeoApp.modal').directive('modalAddToCollection', ['$templateCache', 'modal', 'VideoService', AddToCollection]);

})();