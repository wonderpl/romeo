(function () {

  'use strict';

  var debug = new DebugClass('RomeoApp.publish');

  function PublishRouteProvider($routeProvider, securityAuthorizationProvider) {
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
    function init() {
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
        resolvePublished();
      }

      $scope.pages = [
      ];

      if (video.id) {
        $scope.pages.push({
          url: '#/video/' + video.id,
          title: 'Edit'
        });
        $scope.pages.push({
          url: '#/video/' + video.id + '/comments',
          title: 'Collaborate'
        });
        $scope.pages.push({
          url: '#/video/' + video.id + '/publish',
          title: 'Publish',
          isActive: true
        });
      }
    }

    function isPublishedAtWonder() {
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

    function isPublishedAtYoutube() { return false; }
    function isPublishedAtFacebook() { return false; }
    function isPublishedAtVimeo() { return false; }

    function resolvePublished() {
      $scope.providers.wonderpl.isPublished = isPublishedAtWonder();
      $scope.providers.youtube.isPublished = isPublishedAtYoutube();
      $scope.providers.facebook.isPublished = isPublishedAtFacebook();
      $scope.providers.vimeo.isPublished = isPublishedAtVimeo();

      $scope.isPublished = $scope.providers.wonderpl.isPublished ||
                            $scope.providers.youtube.isPublished ||
                            $scope.providers.facebook.isPublished ||
                            $scope.providers.vimeo.isPublished;
    }

    function getTags() {
      TagService.getPublicTags().then(function(data){
        $scope.tags = data;
      });
    }

    $scope.$on('created-new-tag', function () { updateStatus(); });

    $scope.close = function ($event) {
      updateStatus();
      modal.hide();
    };

    function updateStatus() {
      VideoService.get($scope.video.id).then(function (data) {
        angular.extend($scope.video, data);
        resolvePublished();
      });
    }

    function initProviders() {
      $scope.providers = {
        'wonderpl' : { isPublished : false },
        'youtube'  : { isPublished : false },
        'facebook' : { isPublished : false },
        'vimeo'    : { isPublished : false }
      };
    }

    init();
  }

  angular.module('RomeoApp.publish').controller('PublishCtrl', ['$scope', '$routeParams', 'VideoService', 'TagService', 'modal','video' , publishCtrl]);

})();