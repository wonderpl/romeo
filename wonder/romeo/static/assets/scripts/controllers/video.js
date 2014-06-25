angular.module('fileUpload', [ 'angularFileUpload' ]);

angular.module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$scope', '$location', 'AuthService', '$upload', 'VideoService',
  function($rootScope, $scope, $location, AuthService, $upload, VideoService) {

  'use strict';

  var query = $location.search();

  console.log(query.token);

  $scope.color='#f00';

  var testText = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo ante eu nunc pulvinar, vulputate interdum mauris posuere. Cras semper lectus sit amet lorem eleifend, sit amet fringilla libero facilisis. Mauris id quam tincidunt, luctus arcu nec, interdum tortor.</p><h2>This is an H2 heading</h2><p>Mauris euismod, nisl sit amet vehicula dapibus, magna augue faucibus enim, non egestas ante enim in tellus. Aliquam vulputate magna auctor nisi auctor elementum. Pellentesque eros dolor, fermentum pulvinar consectetur ut, luctus quis nulla. Aliquam euismod imperdiet auctor. Vestibulum ullamcorper quam in nulla sagittis gravida. Vivamus sodales nulla tempor magna viverra, at luctus mi congue.</p><h3>This is an H3 heading</h3><p><strong>This is bold text</strong></p><p><em>This is italicized text</em></p><p><u>This is underlined text</u></p><p><a href="#">This is a link</a></p><p>Suspendisse in urna pellentesque, vestibulum risus sit amet, facilisis sapien. Integer tempus, tellus eu molestie congue, mi nisi pharetra eros, vel auctor neque nibh vitae ligula. Aenean vitae placerat urna.</p><p>Integer faucibus lacinia venenatis. In hac habitasse platea dictumst. Maecenas quis ligula metus. Nam eget imperdiet lectus, a accumsan leo. Nulla bibendum et nibh eu molestie. Pellentesque porttitor sem nec sapien consectetur, ut dictum nibh porta.</p><p>Maecenas gravida gravida mi placerat varius. <strong>Bold</strong>. Quisque at dui at odio tristique volutpat sed vel nibh. <em>Italics</em>. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. <a href="#">Link</a>. Aenean placerat faucibus massa vitae dapibus. <u>Underlined</u>. Curabitur felis lectus, egestas nec ornare nec, vehicula id arcu.</p>';

  var textTitle = 'video title';

  $scope.text = testText;

  $scope.title = textTitle;

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

  /*
  * Listen for the dragStarted event
  */
  $scope.$on('dragStarted', function (e, index) {
    console.log('dragStarted event caught by controller');
  });

  /*
  * Listen for the dragDropped event
  */
  $scope.$on('dragDropped', function (e, index) {
    console.log('dragDropped event caught by controller');
  });

  /*
  * Listen for the dragCancelled event
  */
  $scope.$on('dragCancelled', function (e, index) {
    console.log('dragCancelled event caught by controller');
  });


  function getUploadArgsSuccess (uploadArgs) {

    console.log(uploadArgs);

    // var formData = new FormData();

    // $.each(uploadArgs.fields, function () {
    //     formData.append(this.name, this.value);
    //     if (this.name == 'key') {
    //         $scope.uploadPath = this.value;
    //     }
    // });

    // formData.append('file', data);

    // $.ajax({
    //     url: uploadArgs.action,
    //     type: 'post',
    //     data: formData,
    //     processData: false,
    //     mimeType: 'multipart/form-data',
    //     contentType: false,
    //     xhr: $scope.uploadProgress
    // })
    // .done($scope.uploadSuccess)
    // .fail($scope.uploadFail);
  }

  function getUploadArgsFail (reason) {
    console.log('getUploadArgsFail()');
    console.log(reason);
  }

  $scope.onFileSelect = function($files) {

    var file = $files.length ? $files[0] : null;

    var data = file ? file.data : {};

    VideoService.getUploadArgs().then(getUploadArgsSuccess, getUploadArgsFail);
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
