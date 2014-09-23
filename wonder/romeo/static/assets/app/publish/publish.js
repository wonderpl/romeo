(function () {

  'use strict';

  var debug = new DebugClass('RomeoApp.publish');

  function PublishRouteProvider ($routeProvider, securityAuthorizationProvider) {
    $routeProvider.when('/video/:id/publish', {
      templateUrl: 'publish/publish.tmpl.html',
      resolve: {
        authentication: securityAuthorizationProvider.requireAuthenticated,
        video: ['$route', 'VideoService', function ($route, VideoService) {
          return VideoService.get($route.current.params.id);
        }]
      },
      controller: 'PublishCtrl'
    });
  }

  angular.module('RomeoApp.publish').config(['$routeProvider', 'securityAuthorizationProvider', PublishRouteProvider]);

  function publishCtrl ($scope, $routeParams, VideoService, TagService, modal, video) {
    function isPublishedAtWonder () {
      var published = false;
      var tags = $scope.video.tags.items;
      var l = tags.length;
      while (l--) {
        if (tags[l].public) {
          published = true;
          break;
        }
      }
      return published;
    }

    function isPublishedAtYoutube () { return false; }
    function isPublishedAtFacebook () { return false; }
    function isPublishedAtVimeo () { return false; }

    function resolvePublished () {
      $scope.providers.wonderpl.isPublished = isPublishedAtWonder();
      $scope.providers.youtube.isPublished = isPublishedAtYoutube();
      $scope.providers.facebook.isPublished = isPublishedAtFacebook();
      $scope.providers.vimeo.isPublished = isPublishedAtVimeo();

      $scope.isPublished = $scope.providers.wonderpl.isPublished ||
                            $scope.providers.youtube.isPublished ||
                            $scope.providers.facebook.isPublished ||
                            $scope.providers.vimeo.isPublished;

      console.log($scope.isPublished);
    }



    $scope.hasTag = function (id) {
      return VideoService.hasTag(id, $scope.video);
    };

    function getTags () {
      TagService.getPublicTags().then(function(data){
        console.log(data);
        $scope.availableTags = data;
      });
    }

    $scope.addTag = function (id) {
      VideoService.addToCollection($scope.video.id, id).then(function () {
        updateStatus();
        $scope.$emit('notify', {
          status : 'success',
          title : 'Collection Updated',
          message : 'Video added to collection.'}
        );
      });
    };

    $scope.removeTag = function (id) {
      VideoService.removeFromCollection($scope.video.id, id).then(function () {
        updateStatus();
        $scope.$emit('notify', {
          status : 'success',
          title : 'Collection Updated',
          message : 'Video removed from collection.'}
        );
      });
    };

    function updateStatus () {
      VideoService.get($scope.video.id).then(function (data) {
        console.log(data);
        angular.extend($scope.video, data);
        resolvePublished();
        $scope.isPublic = isPublishedAtWonder();
      });
    }



    $scope.showPublish = function () {
      $scope.showPublishOptions = false;
      modal.load('collection-add-video.html', true, $scope);
    };

    $scope.getTitle = function () {
      return 'Choose or create a Collection to publish your video';
    };

    $scope.close = function () {
      modal.hide();
    };

    $scope.hideAddRemoveAndShowCreateCollection = function () {
      $scope.addVideoToCollection = true;
      $scope.collection = {};
      $scope.collection.scope = 'public';
      modal.load('modal-create-new-collection.html', true, $scope, {});
    };

    $scope.saveNewCollection = function () {
      var data = {
        label : $scope.collection.label,
        description : $scope.collection.description,
        public : ($scope.collection.scope === 'public')
      };

      TagService.createTag(data).then(function (res) {
        res = res.data || res;

        angular.extend(data, res);
        if (! $scope.availableTags) {
          $scope.availableTags = [];
        }
        $scope.availableTags.push(data);
        $scope.video.tags.items.push(data);
        $scope.close();
        $scope.addTag(res.id);
      });
    };

    $scope.hasTagLabel = function (label) {
      var tags = $scope.availableTags || [];
      var l = tags.length;
      while (l--) {
        if (tags[l].label == label) {
          return true;
        }
      }
      return false;
    };

    function initProviders () {
      $scope.providers = {
        'wonderpl' : { isPublished : false },
        'youtube'  : { isPublished : false },
        'facebook' : { isPublished : false },
        'vimeo'    : { isPublished : false }
      };
    }

    function init () {
      if ($routeParams.id) {
        $scope.isModal = true;
        initProviders();
        $scope.video = video;
        $scope.flags = {
          isOwner: true,
          isReview: true
        };
        $scope.showOnlyPublic = true;
        getTags();
        $scope.isPublic = isPublishedAtWonder();
      }
    }


    function getVideo (id) {
      VideoService.get(id).then(function (data) {
        console.log(data);
        $scope.video = data;
        resolvePublished();
        $scope.isPublic = isPublishedAtWonder();
      });
    }



    init();
  }

  angular.module('RomeoApp.publish').controller('PublishCtrl', ['$scope', '$routeParams', 'VideoService', 'TagService', 'modal','video' , publishCtrl]);

})();