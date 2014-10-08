angular.module('RomeoApp.video')
  .directive('videoUpload', ['$templateCache', '$upload', 'VideoService', 'UploadService', function ($templateCache, $upload, VideoService, UploadService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/edit/video-upload.dir.html'),
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
          angular.extend($scope.video, data);
          UploadService.uploadVideo(files[0], $scope.video.id);
        } else {
          VideoService.create(data).then(function (res) {
            res = res.data || res;
            angular.extend($scope.video, res);
            $scope.flags.isOwner = true;
            UploadService.uploadVideo(files[0], res.id);
            $rootScope.uploadingVideoId = res.id;
          });
        }
        $rootScope.isUploadingOrProcessingTemp = true;
        $scope.showPreviewSelector = true;
        $scope.flags.showUpload = false;
      };

      function stripExtension (value) {
        return value.substr(0, value.lastIndexOf('.'));
      }
    }
  };
}]);