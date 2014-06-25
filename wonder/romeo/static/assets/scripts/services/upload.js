/*
* Methods for interacting with the Comment web services
*/
angular.module('RomeoApp.services')
  .factory('UploadService', ['DataService', 'AuthService', '$q',
  function (DataService, AuthService, $q) {

  'use strict';

  function uploadVideo () {

    // var deferred = new $q.defer();
    // AuthService.getSessionId().then(function(response){
    //   deferred.resolve(DataService.request({
    //     url: '/api/comments',
    //     method: 'POST',
    //     data: data
    //   }));
    // });
    // return deferred.promise;
  }

  function getComments () {

  }

  function getProgress () {

  }

  return({
    uploadVideo     : uploadVideo,
    uploadThumbnail : uploadThumbnail,
    getProgress     : getProgress
  });

}]);