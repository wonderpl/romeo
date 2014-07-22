angular.module('RomeoApp.controllers')
  .controller('OrganiseCtrl', ['$scope', 'TagService', '$location', '$modal', '$routeParams', 'VideoService',
  function($scope, TagService, $location, $modal, $routeParams, VideoService) {

    'use strict';

    function refresh () {
      redirect();
    }

    function redirect (path) {
      path = path || '';
      var url = '/organise/' + path;
      $location.path(url, false);
    }

    VideoService.getAll().then(function (data) {
      $scope.videos = data.video.items;
      console.log($scope.videos);
    });

    TagService.getTags().then(function(data){
      console.log(data);
      $scope.tags = data.tag.items;
      if ($routeParams.id) {
        loadTag($routeParams.id);
      }
    });

    $scope.$on('show-collection', function ($event, id) {
      console.log(id);
      redirect(id);
      loadTag(id);
    });

    $scope.$on('save-tag', function ($event) {
      if ($scope.tag) {
        TagService.updateTag($scope.tag);
      }
    });

    $scope.$on('delete-tag', function ($event) {
      if ($scope.tag) {
        TagService.deleteTag($scope.tag.id).then(function () {
          refresh();
        });
      }
    });

    $scope.$on('add-remove-video', function ($event, video) {
      $scope.availableTags = $scope.tags;
      $scope.video = video;
      $scope.isModal = true;
      $modal.load('collection-add-video.html', true, $scope);
    });

    $scope.$on('show-create-collection', function ($event, isPublic) {
      $scope.collection = {};
      $scope.collection.scope = isPublic ? 'public' : 'private';
      $modal.load('modal-create-new-collection.html', true, $scope, {});
    });

    $scope.$on('delete-video', function ($event, video) {
      if (video && window.confirm("Are you sure you want to delete '" + video.title + "'?")) {
        TagService.delete(video.id);
      }
    });

    $scope.saveNewCollection = function () {

      var label = $scope.collection.label;
      var description = $scope.collection.description;
      var isPublic = $scope.collection.scope === 'public';

      var data = {
        label       : label,
        description : description,
        public      : isPublic
      };

      TagService.createTag(data).then(function () {
        TagService.getTags().then(function (data) {
          $scope.tags = data.tag.items;
          $scope.close();
        });
      });
    };

    $scope.close = function () {
      $modal.hide();
      $scope.collection = null;
    };

    $scope.removeTag = function (id) {
      VideoService.removeFromCollection($scope.video.id, id).then(function () {
        VideoService.get($scope.video.id).then(function (data) {
          angular.extend($scope.video, data);
        });
      });
    };

    $scope.hasTag = function (tagId) {
      return VideoService.hasTag(tagId, $scope.video);
    };

    $scope.addTag = function (id) {
      VideoService.addToCollection($scope.video.id, id).then(function () {
        VideoService.get($scope.video.id).then(function (data) {
          angular.extend($scope.video, data);
        });
      });
    };

    function getTagById (id) {
      var tag = null;
      var tags = $scope.tags || [];
      var l = tags.length;
      while (l--) {
        if (tags[l].id === parseInt(id, 10)) {
          tag = tags[l];
          break;
        }
      }
      return tag;
    }

    function loadTag (id) {
      $scope.tag = getTagById(id);
      console.log($scope.tag);
    }

}]);
