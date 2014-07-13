/*
* Methods for interacting with the Comment web services
*/
angular.module('RomeoApp.services').factory('CommentsService',
  ['DataService', '$rootScope', 'AuthService', '$q',
  function (DataService, $rootScope, AuthService, $q) {

  'use strict';

  function addComment (videoId, data) {

    var deferred = new $q.defer();
    AuthService.getSessionId().then(function(response){
      deferred.resolve(DataService.request({
        url: '/api/video/' + videoId + '/comments',
        method: 'POST',
        data: data
      }));
    });
    return deferred.promise;
  }

  function getComments (videoId) {
    var deferred = new $q.defer();
    AuthService.getSessionId().then(function(response){
      deferred.resolve(DataService.request({
        url: '/api/video/' + videoId + '/comments',
        method: 'GET',
      }));
    });
    return deferred.promise;
  }

  return ({
    addComment  : addComment,
    getComments : getComments
  });

}]);