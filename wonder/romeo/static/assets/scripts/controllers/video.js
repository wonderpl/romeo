angular.module('fileUpload', [ 'angularFileUpload' ]);

angular.module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$scope', '$location', 'AuthService', '$upload', 'UploadService', '$routeParams', 'VideoService',
  function($rootScope, $scope, $location, AuthService, $upload, UploadService, $routeParams, VideoService) {

  'use strict';

  if ($routeParams.id) {

    // load video

  } else {

    //'uploading', 'processing', 'error', 'ready', 'published'

    // can't create video until title is added

    initialiseNewScope();

    var data = { title : $scope.video.title };

    if ($scope.video.title) {
      VideoService.create(data).then(videoOnCreate);
    }
  }

  function videoOnCreate (data) {
    console.log('videoOnCreate()');
    // Object {href: "/api/video/85502346", id: 85502346, status: "uploading"}
    console.log(data);
    angular.extend($scope.video, data);
  }

  function initialiseNewScope () {
    $scope.video = {};
    $scope.video.title = 'New Video';

    $scope.isUploading = false;
    $scope.hasThumbnail = false;
    $scope.hasUploaded = false;
  }

  $scope.onFileSelect = function(files) {

    UploadService.uploadVideo(files[0], $scope.video.id);

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

    /*
      {
        "category":"None",
        "date_added":"2014-07-02T08:57:44.478188",
        "date_updated":"2014-07-02T09:02:05.304188",
        "description":"",
        "duration":69,
        "href":"/api/video/42129770",
        "id":42129770,
        "link_title":"",
        "link_url":"",
        "player_logo_url":null,
        "status":"ready",
        "tags":{
          "href":"/api/video/42129770/tags",
          "items":[

          ]
        },
        "thumbnails":{
          "items":[
            {
              "height":121,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOjAzO6fyGr",
              "width":96
            },
            {
              "height":133,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOmEzO-9o6s",
              "width":106
            },
            {
              "height":268,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOmw2Ow7T9l",
              "width":213
            },
            {
              "height":403,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOjBhOzV3Va",
              "width":320
            },
            {
              "height":536,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOmFkOxyVqc",
              "width":426
            },
            {
              "height":806,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOjBrO-I4W8",
              "width":640
            },
            {
              "height":1612,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOjA4MTsiGN",
              "width":1280
            },
            {
              "height":2418,
              "url":"http://ak.c.ooyala.com/AycTdubjpvA6y8lEnyhZVmnNjzOhon-Q/Ut_HKthATH4eww8X4xMDoxOjBzMTt2bJ",
              "width":1920
            }
          ]
        },
        "title":"New Video"
      }
    */
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

  $scope.more = '<a href="http://bbc.co.uk">bbc</a>';



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
