(function () {
'use strict';
var debug = new DebugClass('RomeoApp.services.UploadService');
/*
* Methods for interacting with the Comment web services
*/
angular.module('RomeoApp.services')
  .factory('UploadService', ['$rootScope', '$window', '$q', '$interval', 'DataService', 'AccountService', 'VideoService', UploadService]);

  function UploadService($rootScope, $window, $q, $interval, DataService, AccountService, VideoService) {
    var cachedId;

    // move this
    var cachedkey;

    var _isUploading = false,
        _isProcessing = false,
        _progress = 0;


    $window.onbeforeunload = function () {
      return _isUploading ? 'Leaving this page will cancel your video upload.' : void(0);
    };

    function getParametersSuccess (id, file, response) {
      debug.log('getParametersSuccess()');
      debug.log(id);
      debug.log(file);
      debug.log(response);

      cachedId = id;

      var formData = new FormData();
      var data = response.fields;
      var l = data.length;

      // key has to come first in form data list
      while (l--) {
        debug.log(data[l]);
        formData.append(data[l].name, data[l].value);
        if (data[l].name === 'key') {
          cacheKey(data[l].value);
        }
      }

      formData.append('file', file);

      uploadVideo(formData, response)
      .done(uploadVideoDone)
      .fail(uploadVideoFail);
    }

    function cacheKey (key) {
      cachedkey = key;
    }

    function uploadVideo (formData, uploadParameters) {
      debug.log('uploadVideo()');
      debug.log(formData);
      debug.log(uploadParameters);

      // use data service ?
      return $.ajax({
        url: uploadParameters.action,
        type: 'post',
        data: formData,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        xhr: uploadProgress
      });
    }

    function uploadProgress () {
      var xhr = $.ajaxSettings.xhr();
      xhr.upload.onprogress = onProgress;
      return xhr;
    }

    function onProgress (e) {
      _progress = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
      var data = { progress: _progress };
      $rootScope.$broadcast('video-upload-progress', data);
      debug.log(_progress);
      _isUploading = true;
    }

    function uploadVideoDone (data, textStatus, jqXHR) {
      debug.log('uploadVideoSuccess()');
      debug.log(data);
      debug.log(textStatus);
      debug.log(jqXHR);

      _isUploading = false;
      _isProcessing = true;

      // update video with key
      updateVideo({ filename: cachedkey, status: 'processing' }, cachedId).then(function () {
        // Make sure we've updated status on server before broadcasting succes
        $rootScope.$broadcast('video-upload-complete');

        $rootScope.$emit('notify', {
          status : 'info',
          title : 'Video Upload',
          message : 'Video has been uploaded and is now processing.'}
        );
        // poll video service with video id
        pollVideoForReady(cachedId);
      });
    }

    function pollVideoForReady (id) {
      var promise = $interval(function(){
        VideoService.get(id).then(function (response) {
          $rootScope.$broadcast('video-upload-poll', response);
          if (videoIsReady(response)) {
            $rootScope.isUploadingOrProcessingTemp = false;
            _isProcessing = false;
            _progress = 0;

            $rootScope.$emit('notify', {
              status : 'success',
              title : 'Video Upload Complete',
              message : 'Your Video is Ready, processing complete.'}
            );

            $rootScope.uploadingVideoId = 0;
            // broadcast completion to the world
            $rootScope.$broadcast('video-upload-success', response);
            $interval.cancel(promise);
          }
        });
      }, 10000);
    }

    function videoIsReady (response) {
      return (response.status === 'ready');
    }

    function updateVideo (data, id) {
      debug.log('updateVideo()');
      debug.log(data);
      debug.log(id);
      return VideoService.update(id, data);
    }

    function uploadVideoFail (jqXHR, textStatus, errorThrown) {
      debug.log('uploadVideoFail()');
      debug.log(jqXHR);
      debug.log(textStatus);
      debug.log(errorThrown);

      $rootScope.emit('notify', {
        status : 'error',
        title : 'Upload video',
        message : 'Uploading video failed'
      });

      _progress = 0;
      _isUploading = false;
      _isProcessing = false;
    }

    function getParametersFail (response) {
      debug.log('getParametersFail()');
      debug.log(response);
    }

    // Amazon S3 credentials
    function getUploadParameters () {
      var deferred = new $q.defer();
      deferred.resolve(DataService.request({url: '/api/account/' + AccountService.getAccountId() + '/upload_args'}));
      return deferred.promise;
    }
    var service = {};

    service.uploadVideo = function (file, id) {
      if (service.isUploadingOrProcessing()) {
        $rootScope.emit('notify', {
          status : 'error',
          title : 'Upload video',
          message : 'Another video is uploading, please try again later.'
        });
        var queue = new $q.defer();
        queue.reject('Already uploading');
        return queue.promise;
      }
      debug.log('uploadVideo()');
      debug.log(file);
      debug.log(id);
      $rootScope.isUploadingOrProcessingTemp = true;
      _isUploading = true;
      _isProcessing = false;
      _progress = 0;
      $rootScope.uploadingVideoId = id;
      $rootScope.$broadcast('video-upload-start');
      return getUploadParameters()
        .then(getParametersSuccess.bind(this, id, file), getParametersFail);
    };
    service.isUploadingOrProcessing = function () {
      return _isUploading || _isProcessing;
    };
    service.isUploading = function () {
      return _isUploading;
    };
    service.isProcessing = function () {
      return _isProcessing;
    };
    service.uploadProgress = function () {
      return _progress;
    };
    service.uploadStatus = function () {
      if (! service.isUploadingOrProcessing() )
        return '';
      return _isUploading ? 'uploading' : 'processing';
    };

    return service;
  }

})();