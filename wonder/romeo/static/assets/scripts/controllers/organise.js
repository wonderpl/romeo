angular.module('RomeoApp.controllers')
  .controller('OrganiseCtrl', ['$scope', 'TagService', '$location', '$modal', '$routeParams', 'VideoService',
  function($scope, TagService, $location, $modal, $routeParams, VideoService) {

    'use strict';

    function refresh () {
      redirect('/organise', true);
    }

    function redirect (path, force) {
      $scope.isEdit = false;
      path = path ? '/' + path : '';
      var url = '/organise' + path;
      if (force === true) {
        $location.path(url);
      } else {
        $location.path(url, false);
      }
    }

    VideoService.getAll().then(function (data) {
      $scope.videos = data.video.items;

      // Map over all videos removing html entities from the title
      var elem = $('<div/>');
      for (var i = 0; $scope.videos.length > i; ++i) {
        $scope.videos[i].title = elem.html($scope.videos[i].title).text();
      }
    });

    TagService.getTags().then(function(data){
      $scope.tags = data.tag.items;
      if ($routeParams.id) {
        loadTag($routeParams.id);
      }
    });

    $scope.$on('show-collection', function ($event, id) {
      $scope.customFilterFunction = '';
      redirect(id);
      loadTag(id);
    });

    $scope.$on('show-recent', function ($event) {
      $scope.customFilterFunction = 'isRecent';
      redirect();
      loadTag();
    });

    $scope.$on('save-tag', function ($event) {
      if ($scope.tag) {
        TagService.updateTag($scope.tag).then(function () {
          $scope.$emit('notify', {
            status : 'success',
            title : 'Tag updated',
            message : 'New tag information saved.'}
          );
        });
      }
    });

    $scope.$on('delete-tag', function ($event) {
      if ($scope.tag) {
        TagService.deleteTag($scope.tag.id).then(function () {
          refresh();
          $scope.$emit('notify', {
            status : 'warning',
            title : 'Tag deleted',
            message : $scope.tag.label + ' deleted.'}
          );
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
      if (video) {
        VideoService.delete(video.id).then(function () {
          refresh();
          $scope.$emit('notify', {
            status : 'warning',
            title : 'Video deleted',
            message : 'Video (' + video.id + ') deleted.'}
          );
        });
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

      TagService.createTag(data).then(function (tag) {
        TagService.getTags().then(function (data) {
          $scope.tags = data.tag.items;
          $scope.close();
          redirect(tag.id);
          loadTag(tag.id);
          $scope.$emit('notify', {
            status : 'success',
            title : 'New Collection Created',
            message : 'Collection details saved.'}
          );
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
          $scope.$emit('notify', {
            status : 'info',
            title : 'Collection Updated',
            message : 'Video removed from collection.'}
          );
        });
      });
    };

    $scope.hasTag = function (tagId) {
      return VideoService.hasTag(tagId, $scope.video);
    };

    $scope.hasTagLabel = function (label) {
      return (getTagByLabel(label) !== null);
    };

    $scope.addTag = function (id) {
      VideoService.addToCollection($scope.video.id, id).then(function () {
        VideoService.get($scope.video.id).then(function (data) {
          angular.extend($scope.video, data);
          $scope.$emit('notify', {
            status : 'info',
            title : 'Collection Updated',
            message : 'Video added to collection.'}
          );
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

    function loadTag (id) {
      $scope.tag = getTagById(id);
    }

}]);
