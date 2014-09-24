angular.module('RomeoApp.directives')
  .directive('videoUpload', ['$templateCache', '$upload', function ($templateCache, $upload) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/video-upload.dir.html'),
    controller: function ($scope) {
      $scope.onFileSelect = function(files) {
        $scope.video.title = $scope.video.title || stripExtension(files[0].name);
        var data = { title : $scope.video.title };

        $scope.$emit('notify', {
          status : 'info',
          title : 'Uploading Video',
          message : 'Upload started for video ' + $scope.video.title + '.'}
        );

        if ($scope.video.id) {
          persistVideoData(data);
          UploadService.uploadVideo(files[0], $scope.video.id);
        } else {
          VideoService.create(data).then(function (data) {
            persistVideoData(data);
            $scope.flags.isOwner = true;
            UploadService.uploadVideo(files[0], data.id);
            $rootScope.uploadingVideoId = data.id;
          });
        }
        $rootScope.isUploadingOrProcessingTemp = true;
        $scope.showPreviewSelector = true;
        $scope.flags.showUpload = false;
      };
    }
  };
}]);