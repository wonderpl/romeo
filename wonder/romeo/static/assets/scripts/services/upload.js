/*
* Methods for interacting with the Comment web services
*/
angular.module('RomeoApp.services')
  .factory('UploadService', ['DataService', 'AuthService', '$q', '$interval', 'VideoService',
  function (DataService, AuthService, $q, $interval, VideoService) {

  'use strict';

  function getParametersSuccess (id, file, response) {

    console.log('getParametersSuccess()');
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
        contentType: false
        //xhr: $scope.uploadProgress
    });
  }

  function uploadVideoDone (data, textStatus, jqXHR) {

    console.log('uploadVideoSuccess()');
    console.log(data);
    console.log(textStatus);
    console.log(jqXHR);

    // update video with key
    updateVideo({ filename: cachedkey }, cachedId);

    // poll video service with video id
    pollVideoForReady(cachedId);
  }

  var promise;

  function pollVideoForReady (id) {
    promise = $interval(function(){
      VideoService.get(id).then(videoOnReady);
    }, 10000);
  }

  function videoOnReady (response) {
    if (response.status === 'ready') {
      $interval.cancel(promise);
      // broadcast completion to the world
    }
  }

  function updateVideo (data, id) {

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
    uploadVideo : function (id, file) {

      return getUploadParameters()
        .then(getParametersSuccess.bind(this, id, file), getParametersFail);
    },
    uploadVideos : function (files) {

      // maybe one day ...
      this.uploadVideo(files[0]);
    }
  });

}]);