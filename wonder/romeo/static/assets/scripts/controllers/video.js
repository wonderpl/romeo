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

  function videoOnCreate (response) {
    console.log('videoOnCreate()');
    // Object {href: "/api/video/85502346", id: 85502346, status: "uploading"}
    console.log(response);
    angular.extend($scope.video, response);
  }

  function initialiseNewScope () {
    $scope.video = {};
  }





  var query = $location.search();

  console.log(query.token);

  $scope.color='#f00';

  $scope.more = '<a href="http://bbc.co.uk">bbc</a>';

  $scope.$watch(
     // This is the listener function
     function() { return $scope.text; },
     // This is the change handler
     function(newValue, oldValue) {
       if ( newValue !== oldValue ) {
        console.log($scope.text);
       }
     }
   );

  var isEdit;

  var isReview;

  var isComments;

  $scope.isEdit = false;

  $scope.isReview = false;

  $scope.isComments = true;

  $scope.hasVideo = false;

  $scope.hasSelectedVideo = false;

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

  $scope.onFileSelect = function(files) {

    console.log('onFileSelect()');

    // send data to upload service

    // for current video item

    UploadService.uploadVideos(files);

  };


  $scope.$on('video-upload-success', videoUploadOnSuccess);

  function videoUploadOnSuccess(event, args) {

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
