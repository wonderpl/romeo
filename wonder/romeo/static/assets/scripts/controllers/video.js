angular.module('fileUpload', [ 'angularFileUpload' ]);

angular.module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$scope', '$location', 'AuthService', '$upload', 'UploadService', '$routeParams', 'VideoService', '$sce', '$document', 'TagService',
  function($rootScope, $scope, $location, AuthService, $upload, UploadService, $routeParams, VideoService, $sce, $document, TagService) {

  'use strict';

  // hack
  // https://github.com/thijsw/angular-medium-editor/pull/6
  var titlePlaceholderHack = 'Untitled Video';

  TagService.getTags().then(function (data) {
    console.log(data);
    $scope.tags = data.tag.items;
  });

  initialiseNewScope();

  if ($routeParams.id) {

    // load video

    VideoService.get($routeParams.id).then(function (data) {

      angular.extend($scope.video, data);
      $scope.loadVideo($scope.video.id);

      $scope.hasProcessed = true;
      $scope.showVideoEdit = true;
      $scope.showUpload = false;

    });
  }

  function persistVideoData (data) {
    console.log('persistVideoData()');
    // Object {href: "/api/video/85502346", id: 85502346, status: "uploading"}
    console.log(data);
    angular.extend($scope.video, data);
  }

  function initialiseNewScope () {
    $scope.video = $scope.video || {};
    $scope.showUpload = true;
    $scope.isUploading = false;
    $scope.hasProcessed = false;
    $scope.videoHasLoaded = false;
    $scope.embedUrl = '';

    $scope.titlePlaceholder = titlePlaceholderHack;
  }

  $scope.onPreviewImageSelect = function (files) {

    console.log('onPreviewImageSelect()');

    console.log(files);

    VideoService.saveCustomPreview($scope.video.id, files[0]).then(function(data){
        console.log(data);
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

    var data = { title : $scope.video.title };

    // this is a cludge
    // having to create a new video record at different points
    if ($scope.video.id) {
      persistVideoData(data);
      UploadService.uploadVideo(files[0], data.id);
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
    console.log('videoUploadOnComplete()');
    $scope.video.status = 'processing';
    $scope.isUploading = false;
  }

  $scope.$on('video-upload-poll', videoUploadOnPoll);

  function videoUploadOnPoll (event, data) {
    console.log('video-upload-poll');
    console.log(data);
    angular.extend($scope.video, data);
  }

  $scope.loadVideo = function (id) {

    console.log('loadVideo()');

    var url = '//' + $location.host() + ':' + $location.port() + '/embed/' + id + '/?controls=1';
    $scope.embedUrl = $sce.trustAsResourceUrl(url);

    $scope.videoHasLoaded = true;

    $scope.titlePlaceholder = '';

    // fill out rest of page details
  };

  $scope.$watch(
    function() { return $scope.embedUrl; },
    function(newValue, oldValue) {
      if ((newValue !== '') && (oldValue !== '')) {
        $('#VideoPlayerIFrame').attr('src', $('#VideoPlayerIFrame').attr('src'));
      }
    });

  $scope.save = function () {

    VideoService.update($scope.video.id, $scope.video).then(function () {
      console.log('saved');
    });
  };

  $scope.cancel = function () {

    VideoService.get($scope.id).then(function (data) {
      angular.extend($scope.video, data);
    });
  };

  $scope.$on('video-upload-success', videoUploadOnSuccess);

  function videoUploadOnSuccess (event, data) {

    console.log('videoUploadOnSuccess()');
    console.log(event);
    console.log(data);

    angular.extend($scope.video, data);

    var url = '/video/' + $scope.video.id;

    $location.path(url, false);

    $scope.hasProcessed = true;
  }

  $scope.$on('video-upload-start', videoUploadOnStart);

  function videoUploadOnStart (event) {

    console.log('videoUploadOnStart()');

    $scope.isUploading = true;
  }







  var query = $location.search();

  console.log(query.token);

  $scope.color='#f00';



  var isEdit;

  var isReview;

  var isComments;

  $scope.isEdit = false;

  $scope.isReview = false;

  $scope.isComments = true;

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
