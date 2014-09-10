(function () {

  'use strict';

  var debug = new DebugClass('RomeoApp.publish');

  function PublishRouteProvider ($routeProvider, securityAuthorizationProvider) {
    $routeProvider.when('/video/:id/publish', {
      templateUrl: 'publish/publish.tmpl.html',
      resolve: securityAuthorizationProvider.requireAuthenticated,
      controller: 'PublishCtrl'
    });
  }

  angular.module('RomeoApp.publish').config(['$routeProvider', 'securityAuthorizationProvider', PublishRouteProvider]);

  function publishCtrl ($scope, $routeParams, VideoService, TagService, modal) {


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
      });
    }



    $scope.showPublish = function () {
      modal.load('collection-add-video.html', true, $scope);
    };

    $scope.close = function () {
      modal.hide();
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
      console.log('init()');
      if ($routeParams.id) {
        $scope.isModal = true;
        initProviders();
        getVideo($routeParams.id);
        getTags();
      }
    }


    function getVideo (id) {
      VideoService.get(id).then(function (data) {
        console.log(data);
        $scope.video = data;
        resolvePublished();
      });
    }



    init();
  }

  angular.module('RomeoApp.publish').controller('PublishCtrl', ['$scope', '$routeParams', 'VideoService', 'TagService', 'modal', publishCtrl]);

})();