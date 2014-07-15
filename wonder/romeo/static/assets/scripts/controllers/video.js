angular.module('fileUpload', [ 'angularFileUpload' ]);

angular.module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$scope', '$location', 'AuthService', '$upload', 'UploadService', '$routeParams', 'VideoService', '$sce', '$document', 'TagService', 'CommentsService', '$timeout',
  function($rootScope, $scope, $location, AuthService, $upload, UploadService, $routeParams, VideoService, $sce, $document, TagService, CommentsService, $timeout) {

    'use strict';

    function persistVideoData (data) {
      // Object {href: "/api/video/85502346", id: 85502346, status: "uploading"}
      angular.extend($scope.video, data);
    }

    function initialiseNewScope () {

      $scope.video = $scope.video || {};
      $scope.titlePlaceholder = '';
      $scope.straplinePlaceholder = '';
      $scope.descriptionPlaceholder = '';
      $scope.showUpload = true;
      $scope.isUploading = false;
      $scope.hasProcessed = false;
      $scope.videoHasLoaded = false;
      $scope.embedUrl = '';
      $scope.currentTime = 0;
    }

    $scope.$watch(
      function() { return $scope.video.title; },
      function(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          $scope.titlePlaceholder = '';
        } else {
          $scope.titlePlaceholder = 'UntitledVideo';
        }
      }
    );

    $scope.$watch(
      function() { return $scope.video.strapline; },
      function(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          $scope.straplinePlaceholder = '';
        } else {
          $scope.straplinePlaceholder = 'Subtitle';
        }
      }
    );

    $scope.$watch(
      function() { return $scope.video.strapline; },
      function(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          $scope.descriptionPlaceholder = '';
        } else {
          $scope.descriptionPlaceholder = 'Additional content including but not limited to: recipes, ingredients, lyrics, stories, etc.';
        }
      }
    );

    $scope.$watch(
      function() { return $scope.video ? $scope.video.id : null; },
      function(newValue, oldValue) {
        if (newValue !== '' && newValue !== oldValue) {
          CommentsService.getComments($scope.video.id).then(function (data) {
            console.log(data);
            $scope.comments = data.comment.items;
          });
        }
      }
    );

    $scope.onPreviewImageSelect = function (files) {
      VideoService.saveCustomPreview($scope.video.id, files[0]).then(function(data){
        angular.extend($scope.video, data);
        $scope.loadVideo($scope.video.id);
        $scope.showPreviewSelector = false;
        $scope.showVideoEdit = true;
      });
    };

    function stripExtension (value) {

      return value.substr(0, value.lastIndexOf('.'));
    }

    $scope.onFileSelect = function(files) {

      $scope.video.title = $scope.video.title || stripExtension(files[0].name);
      $scope.titlePlaceholder = '';
      $scope.straplinePlaceholder = '';
      $scope.descriptionPlaceholder = '';

      var data = { title : $scope.video.title };

      // this is a cludge
      // having to create a new video record at different points
      if ($scope.video.id) {
        persistVideoData(data);
        UploadService.uploadVideo(files[0], $scope.video.id);
      } else {
        VideoService.create(data).then(function (data) {
          persistVideoData(data);
          UploadService.uploadVideo(files[0], data.id);
        });
      }


      $scope.showPreviewSelector = true;
      $scope.showUpload = false;
      $scope.isUploading = true;
    };

    $scope.closePreviewSelector = function () {

      $scope.showPreviewSelector = false;
      $scope.showThumbnailSelector = false;
      $scope.showVideoEdit = true;

      if (!$scope.videoHasLoaded && $scope.hasProcessed) {
        $scope.loadVideo($scope.video.id);
      }
    };

    $scope.$on('video-upload-complete', videoUploadOnComplete);

    function videoUploadOnComplete (event) {
      // manaual ajax request doesn't return video object to extend what we have in scope
      $scope.video.status = 'processing';
      $scope.isUploading = false;
    }

    $scope.$on('video-upload-poll', videoUploadOnPoll);

    function videoUploadOnPoll (event, data) {
      angular.extend($scope.video, data);
    }

    $scope.loadVideo = function (id) {
      var url = '//' + $location.host() + ':' + $location.port() + '/embed/' + id + '/?controls=1';
      $scope.embedUrl = $sce.trustAsResourceUrl(url);

      $scope.videoHasLoaded = true;
    };

    $scope.$watch(
      function() { return $scope.embedUrl; },
      function(newValue, oldValue) {
        if ((newValue !== '') && (oldValue !== '')) {
          $('#VideoPlayerIFrame').attr('src', $('#VideoPlayerIFrame').attr('src'));
        }
      });

    $scope.save = function () {

      VideoService.update($scope.video.id, $scope.video);
    };

    $scope.cancel = function () {

      VideoService.get($scope.video.id).then(function (data) {
        angular.extend($scope.video, data);
      });
    };

    $scope.$on('video-upload-success', videoUploadOnSuccess);

    function videoUploadOnSuccess (event, data) {

      angular.extend($scope.video, data);

      var url = '/video/' + $scope.video.id + '/edit';

      $location.path(url, false);

      $scope.hasProcessed = true;
    }

    $scope.$on('video-upload-start', videoUploadOnStart);

    function videoUploadOnStart (event) {

      $scope.isUploading = true;
    }


    $scope.$on('video-seek', videoOnSeek);

    function videoOnSeek (event, seconds) {

      if ($scope.player) {
        $scope.player.seek(seconds);
      }
    }

  $scope.videoCurrentTime = 0;
  $scope.videoTotalTime = 0;

  function pollIFrame () {
    $timeout(checkIFramePlayer, 1000);
  }

  function checkIFramePlayer () {
    var frames = document.getElementsByClassName('video-player__frame');
    if (frames.length) {
      var frame = frames[0].contentWindow || frames[0].contentDocument.parentWindow;
      if (frame.player) {
        $scope.player = frame.player;
        $scope.videoTotalTime = $scope.player.getTotalTime();
      }
      var OO = frame.OO;
      if (OO && OO.ready) {
        OO.ready(function () {
          bindEvents(OO);
        });

      } else {
        pollIFrame();
      }

    } else {
      pollIFrame();
    }
  }

  pollIFrame();



  // http://support.ooyala.com/developers/documentation/concepts/xmp_securexdr_view_mbus.html
  // http://support.ooyala.com/developers/documentation/api/player_v3_api_events.html
  function bindEvents (OO) {

    var bus = $scope.player.mb;

    bus.subscribe(OO.EVENTS.PLAYBACK_READY, 'WonderUIModule', function () {

      console.log('PLAYBACK_READY');
    });

    bus.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'WonderUIModule', function(eventName, currentTime) {

      $scope.videoCurrentTime = currentTime;

      $scope.progress = (Math.round((($scope.videoCurrentTime * 1000)/$scope.videoTotalTime) * 100 * 100))/100;

      $scope.$apply();

    });

    bus.subscribe(OO.EVENTS.SEEKED, 'WonderUIModule', function (seconds) {

      $scope.player.pause();
    });

  }






    var query = $location.search();

    $scope.color='#f00';



    $scope.isEdit = false;

    $scope.isReview = false;

    $scope.isComments = false;

    $scope.displaySection = function (section) {

      switch (section) {
        case 'edit':
          $scope.isEdit = true;
          $scope.isReview = $scope.isComments = false;
        break;
        case 'comments':
          $scope.isComments = true;
          $scope.isReview = $scope.isEdit = false;
        break;
        default:
          $scope.isReview = true;
          $scope.isEdit = $scope.isComments = false;
        break;
      }
    };

    // probably a better way of doing this
    if ($location.path().indexOf('comments') > -1) {

      $scope.displaySection('comments');

    } else if ($location.path().indexOf('edit') > -1) {

      $scope.displaySection('edit');

    }

    TagService.getTags().then(function (data) {

      $scope.tags = data.tag.items;
    });

    initialiseNewScope();

    if ($routeParams.id) {

      // load video

      VideoService.get($routeParams.id).then(function (data) {

        angular.extend($scope.video, data);

        $scope.hasProcessed = ($scope.video.status === 'ready');
        $scope.showUpload = ($scope.video.status === 'uploading');

        if (($scope.video.status === 'ready') || ($scope.video.status === 'published')) {
          $scope.loadVideo($scope.video.id);
        }

        $scope.showVideoEdit = (($scope.video.status === 'ready') || ($scope.video.status === 'published'));

      });

    } else {

      $scope.displaySection('edit');
    }

    AuthService.loginAsCollaborator(query.token).then(function(data){
      if (data.authenticatedAsOwner) {

        // show comments

        // allow edit/review/comments

        $scope.isOwner = true;

      } else if (data.authenticatedAsCollaborator) {

        // show comments

        // allow review/comments

        $scope.isCollaborator = true;

      } else {

        // redirect to 400 not authenticated
      }
    }, function(err){

      console.log(err);

    });

}]);
