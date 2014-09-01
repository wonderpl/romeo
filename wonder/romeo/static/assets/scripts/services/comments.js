/*
* Methods for interacting with the Comment web services
*/
angular.module('RomeoApp.services').factory('CommentsService',
  ['$q', 'DataService',
  function ($q, DataService) {

  'use strict';

  function addComment (videoId, data) {
    return DataService.request({
      url: '/api/video/' + videoId + '/comments',
      method: 'POST',
      data: data
    });
  }

  function getComments (videoId) {
    return DataService.request({
      url: '/api/video/' + videoId + '/comments',
      method: 'GET'
    });
  }

  function notify (videoId) {
    var deferred = new $q.defer();
    deferred.resolve(DataService.request({
      url: '/api/video/' + videoId + '/comments/notification',
      method: 'POST',
    }));
    return deferred.promise;
  }

  function resolveComment (videoId, commentId) {
    var deferred = new $q.defer();
    deferred.resolve(DataService.request({
      url: '/api/video/' + videoId + '/comments/' + commentId,
      method: 'PATCH',
      data: {
        resolved : true
      }
    }));
    return deferred.promise;
  }

  function unresolveComment (videoId, commentId) {
    var deferred = new $q.defer();
    deferred.resolve(DataService.request({
      url: '/api/video/' + videoId + '/comments/' + commentId,
      method: 'PATCH',
      data: {
        resolved : false
      }
    }));
    return deferred.promise;
  }

  return ({
    resolveComment    : resolveComment,
    unresolveComment  : unresolveComment,
    notify            : notify,
    addComment        : addComment,
    getComments       : getComments
  });

}]);