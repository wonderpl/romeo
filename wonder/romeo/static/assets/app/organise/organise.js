(function () {

  'use strict';

    function organiseController ($rootScope, $scope, TagService, $location, modal, $routeParams, $route, VideoService, SecurityService, UserService) {

      var debug = new DebugClass('OrganiseCtrl');

      function init() {
        if (! $routeParams.id && SecurityService.isCollaborator() ) {
          $location.url('/organise/collaboration');
        }
        refresh(); // Call this on page load to load all the data

        // Scope listners:
        $scope.$on('show-collection', function ($event, id) {
          $event.stopPropagation = true;
          $scope.filterByRecent = false;
          $scope.filterByCollaboration = false;
          redirect(id, false);
          setCollection(id);
        });

        $scope.$on('show-recent', function ($event) {
          $event.stopPropagation = true;
          $scope.filterByRecent = true;
          $scope.filterByCollaboration = false;
          $scope.tag = null;
          redirect('recent', false);
          setCollection();
        });

        $scope.$on('show-collaboration', function ($event) {
          $event.stopPropagation = true;
          $scope.filterByRecent = false;
          $scope.filterByCollaboration = true;
          $scope.tag = null;
          redirect('collaboration', false);
          setCollection();
        });

        $scope.$on('save-tag', function ($event) {
          $event.stopPropagation = true;
          if ($scope.tag) {
            TagService.updateTag($scope.tag).then(function () {
              $scope.$emit('notify', {
                status : 'success',
                title : 'Collection updated',
                message : 'Your changes have been saved.'}
              );
              refresh();
            });
          }
        });

        $scope.$on('delete-tag', function ($event) {
          $event.stopPropagation = true;
          if ($scope.tag) {
            TagService.deleteTag($scope.tag.id).then(function () {
              $scope.$emit('notify', {
                status : 'success',
                title : 'Collection deleted',
                message : $scope.tag.label + ' deleted.'}
              );
              setCollection();
              refresh();
            });
          }
        });

        $scope.$on('add-remove-video', function ($event, video) {
          $event.stopPropagation = true;
          $scope.availableTags = $scope.tags;
          $scope.video = video;
          $scope.isModal = true;
          modal.load('collection-add-video.html', true, $scope);
        });

        $scope.$on('show-create-collection', function ($event, isPublic) {
          $event.stopPropagation = true;
          $scope.collection = {};
          $scope.collection.scope = isPublic ? 'public' : 'private';
          modal.load('modal-create-new-collection.html', true, $scope, {});
        });

        $scope.$on('delete-video', function ($event, video) {
          $event.stopPropagation = true;
          if (video) {
            debug.log(video);
            VideoService.delete(video.id).then(function () {
              $scope.$emit('notify', {
                status : 'success',
                title : 'Video deleted',
                message : "'" + video.title + "' deleted."}
              );
              refresh();
            });
          }
        });

        // Scope methods:

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
              $scope.close(); // Close modal window
              $scope.$emit('notify', {
                status : 'success',
                title : 'New Collection Created',
                message : 'Collection details saved.'}
              );
              setCollection(tag.id);
              refresh();
            });
          });
        };

        // Root Scope broadcast event listners

        $rootScope.$on('video-upload-complete', function (event, data) {
          debug.info('Recieved video-upload-complete message');
          getAllVideos();
        });

        $rootScope.$on('video-upload-success', function (event, data) {
          debug.info('Recieved video-upload-success message');
          getAllVideos();
        });

        $rootScope.$on('video-upload-start', function (event, data) {
          debug.info('Recieved video-upload-start message');
          getAllVideos();
        });
      }

      function refresh () {
        getAllVideos();
        getCollaborationVideos();
        getAllCollections();
      }

      function getAllVideos() {
        VideoService.getAll().then(function (data) {
          $scope.videos = data.video.items;

          // Map over all videos removing html entities from the title
          var elem = $('<div/>');
          for (var i = 0; $scope.videos.length > i; ++i) {
            $scope.videos[i].title = elem.html($scope.videos[i].title).text();
          }
        });
      }

      function getAllCollections() {
        TagService.getTags().then(function(data){
          $scope.tags = data.tag.items;
          var id = $routeParams.id;
          if (id) {
            if (id === 'recent') {
              $scope.filterByRecent = true;
              setCollection();
            } else if (id === 'collaboration') {
              $scope.filterByCollaboration = true;
              setCollection();
            } else {
              setCollection(id);
            }
          }
        });
      }

      function setCollection(id) {
        $scope.tag = getTagById(id);
      }

      function getCollaborationVideos() {
        UserService.getCollaboratorVideos().success(function (data) {
          $scope.collaborationVideos = data.video.items;
        });
      }





      // OLD code :

      function redirect (path, force) {
        $scope.isEdit = false;
        path = path ? '/' + path : '';
        var url = '/organise' + path;
        if (force === true) {
          $location.path(url, true);
        } else {
          $location.path(url, false);
        }
      }

      $scope.close = function () {
        modal.hide();
        $scope.collection = null;
        $scope.addVideoToCollection = false;
        refresh();
      };

      $scope.hideAddRemoveAndShowCreateCollection = function () {
        modal.hide();
        $scope.collection = null;
        $scope.addVideoToCollection = true;
        $scope.$emit('show-create-collection', false);
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
          // Update videos on collection list
          getAllVideos();
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

      $scope.collaborator = function () {
        return SecurityService.isCollaborator();
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

      //@TODO: Temporary fix until we can remove MainController and
      // use resolve on RouteProvider to validate logged in state
      SecurityService.requireAuthenticated().then(function () {
        init();
      });

      //@FIXME: BAD!! Never touch DOM in controller
      $('.editable').on('input', function(e) {
        debug.log(e);
        debug.log(e.currentTarget);
        debug.log($(e.currentTarget).text());
        $(e.currentTarget).text().replace(/&nbsp;/g, '');
      });
  }

  angular.module('RomeoApp.controllers').controller('OrganiseCtrl', ['$rootScope', '$scope', 'TagService', '$location', 'modal', '$routeParams', '$route', 'VideoService', 'SecurityService', 'UserService', organiseController]);

})();

