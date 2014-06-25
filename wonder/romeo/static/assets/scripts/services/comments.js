/*
* Methods for interacting with the Comment web services
*/
angular.module('RomeoApp.services', []).factory('CommentsService',
  ['DataService', '$rootScope', 'AuthService', '$q',
  function (DataService, $rootScope, AuthService, $q) {

  'use strict';

  function addComment (data) {

    var deferred = new $q.defer();
    AuthService.getSessionId().then(function(response){
      deferred.resolve(DataService.request({
        url: '/api/comments',
        method: 'POST',
        data: data
      }));
    });
    return deferred.promise;
  }

  function getComments () {
    var deferred = new $q.defer();
    AuthService.getSessionId().then(function(response){
      deferred.resolve(DataService.request({
        url: '/api/comments',
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