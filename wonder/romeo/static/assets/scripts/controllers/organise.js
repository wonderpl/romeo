angular.module('RomeoApp.controllers')
  .controller('OrganiseCtrl', ['$scope', 'TagService', '$location', '$modal', '$routeParams', '$route', 'VideoService',
  function($scope, TagService, $location, $modal, $routeParams, $route, VideoService) {

    'use strict';

    function refresh () {
      $route.reload();
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
      var id = $routeParams.id
      if (id) {
        if (id === 'recent') {
          $scope.customFilterFunction = 'isRecent';
          loadTag();
        } else {
          loadTag(id);
        }
      }
    });

    $scope.$on('show-collection', function ($event, id) {
      $scope.customFilterFunction = '';
      redirect(id);
      loadTag(id);
    });

    $scope.$on('show-recent', function ($event) {
      redirect('recent', true);
    });

    $scope.$on('save-tag', function ($event) {
      if ($scope.tag) {
        TagService.updateTag($scope.tag).then(function () {
          $scope.$emit('notify', {
            status : 'success',
            title : 'Collection updated',
            message : 'Your changes have been saved.'}
          );
        });
      }
    });

    $scope.$on('delete-tag', function ($event) {
      if ($scope.tag) {
        TagService.deleteTag($scope.tag.id).then(function () {
          redirect('/organise', true);
          $scope.$emit('notify', {
            status : 'success',
            title : 'Collection deleted',
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
        console.log(video);
        VideoService.delete(video.id).then(function () {
          refresh();
          $scope.$emit('notify', {
            status : 'success',
            title : 'Video deleted',
            message : "'" + video.title + "' deleted."}
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
          if ($scope.addVideoToCollection) {
            $scope.addTag(tag.id);
            $scope.addVideoToCollection = false;
          }
          $scope.close();
          loadTag(tag.id);
          refresh();
          // redirect('/organise', true);
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
      $scope.addVideoToCollection = false;
      refresh();
    };

    $scope.hideAddRemoveAndShowCreateCollection = function () {
      $modal.hide();
      $scope.collection = null;
      $scope.addVideoToCollection = true;
      $scope.$emit('show-create-collection', false);
    };

    $scope.removeTag = function (id) {
      VideoService.removeFromCollection($scope.video.id, id).then(function () {
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
            status : 'success',
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

    $('.editable').on('input', function(e) {
      console.log(e);
      console.log(e.currentTarget);
      console.log($(e.currentTarget).text());
      $(e.currentTarget).text().replace(/&nbsp;/g, '');
    });

}]);
