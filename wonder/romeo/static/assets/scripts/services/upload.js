/*
* Methods for interacting with the Comment web services
*/
angular.module('RomeoApp.services')
  .factory('UploadService', ['DataService', 'AuthService', '$q', '$timeout', 'VideoService', '$rootScope',
  function (DataService, AuthService, $q, $timeout, VideoService, $rootScope) {

  'use strict';

  function getParametersSuccess (id, file, response) {

    console.log('getParametersSuccess()');
    console.log(id);
    console.log(file);
    console.log(response);

    cachedId = id;

    var formData = new FormData();
    var data = response.fields;
    var l = data.length;

    // key has to come first in form data list
    while (l--) {
      console.log(data[l]);
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

  var cachedId;

  // move this
  var cachedkey;

  function cacheKey (key) {
    cachedkey = key;
  }

  function uploadVideo (formData, uploadParameters) {

    console.log('uploadVideo()');
    console.log(formData);
    console.log(uploadParameters);

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
    var progress = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
    var data = { progress: progress };
    $rootScope.$broadcast('video-upload-progress', data);
    console.log(progress);
  }

  function uploadVideoDone (data, textStatus, jqXHR) {

    console.log('uploadVideoSuccess()');
    console.log(data);
    console.log(textStatus);
    console.log(jqXHR);

    $rootScope.$broadcast('video-upload-complete');

    // update video with key
    updateVideo({ filename: cachedkey }, cachedId).then(function () {
      // poll video service with video id
      pollVideoForReady(cachedId);
    });
  }

  function pollVideoForReady (id) {
    $timeout(function(){
      VideoService.get(id).then(function (response) {
        $rootScope.$broadcast('video-upload-poll', response);
        if (videoIsReady(response)) {
          // broadcast completion to the world
          $rootScope.$broadcast('video-upload-success', response);
        } else {
          pollVideoForReady(id);
        }
      });
    }, 10000);
  }

  function videoIsReady (response) {
    return (response.status === 'ready');
  }

  function updateVideo (data, id) {
    console.log('updateVideo()');
    console.log(data);
    console.log(id);
    return VideoService.update(id, data);
  }

  function uploadVideoFail (jqXHR, textStatus, errorThrown) {
    console.log('uploadVideoSuccess()');
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  }

  function getParametersFail (response) {
    console.log('getParametersFail()');
    console.log(response);
  }

  // Amazon S3 credentials
  function getUploadParameters () {
    var deferred = new $q.defer();
    AuthService.getSessionId().then(function(response){
        deferred.resolve(DataService.request({url: '/api/account/' + response + '/upload_args'}));
    });
    return deferred.promise;
  }

  return({
    uploadVideo : function (file, id) {
      console.log('uploadVideo()');
      console.log(file);
      console.log(id);
      $rootScope.$broadcast('video-upload-start');
      return getUploadParameters()
        .then(getParametersSuccess.bind(this, id, file), getParametersFail);
    }
  });

}]);