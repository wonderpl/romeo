angular.module('fileUpload', [ 'angularFileUpload' ]);

angular.module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$scope', '$location', 'AuthService', '$upload', 'UploadService', '$routeParams', 'VideoService', '$sce',
  function($rootScope, $scope, $location, AuthService, $upload, UploadService, $routeParams, VideoService, $sce) {

  'use strict';

  initialiseNewScope();

  if ($routeParams.id) {

    // load video

    VideoService.get($routeParams.id).then(function (data) {

      angular.extend($scope.video, data);

      var url = '//' + $location.host() + ':' + $location.port() + '/embed/' + $scope.video.id + '/?controls=1';
      $scope.embedUrl = $sce.trustAsResourceUrl(url);

      if ($scope.video.duration) {
        $scope.hasThumbnail = true;
        $scope.hasUploaded = true;
      }
    });
  }

  function persistVideoData (data) {
    console.log('persistVideoData()');
    // Object {href: "/api/video/85502346", id: 85502346, status: "uploading"}
    console.log(data);
    angular.extend($scope.video, data);
  }

  function initialiseNewScope () {
    $scope.video = {};

    $scope.isUploading = false;
    $scope.hasThumbnail = false;
    $scope.hasUploaded = false;
  }

  $scope.onPreviewImageSelect = function (files) {

    console.log(files);
  };

  $scope.onFileSelect = function(files) {

    $scope.video.title = $scope.video.title || files[0].name;

    var data = { title : $scope.video.title };

    VideoService.create(data).then(function (data) {
      persistVideoData(data);
      UploadService.uploadVideo(files[0], data.id);
    });

    $scope.isUploading = true;
  };

  $scope.$on('video-upload-complete', videoUploadOnComplete);

  function videoUploadOnComplete (event) {
    // manaual ajax request doesn't return video object to extend what we have in scope
    console.log('videoUploadOnComplete()');
    $scope.video.status = 'processing';
  }

  $scope.$on('video-upload-poll', videoUploadOnPoll);

  function videoUploadOnPoll (event, data) {
    console.log('video-upload-poll');
    console.log(data);
    angular.extend($scope.video, data);
  }

  $scope.$on('video-upload-success', videoUploadOnSuccess);

  function videoUploadOnSuccess (event, data) {

    console.log('videoUploadOnSuccess()');
    console.log(event);
    console.log(data);

    angular.extend($scope.video, data);

    $scope.hasUploaded = true;
  }

  $scope.$on('video-upload-start', videoUploadOnStart);

  function videoUploadOnStart (event) {

    console.log('videoUploadOnStart()');
    console.log(event);

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
