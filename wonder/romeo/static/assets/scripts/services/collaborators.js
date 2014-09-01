/*
* Methods for interacting with the Collaborator web services
* https://github.com/rockpack/romeo/blob/master/docs/video.md
*/
angular.module('RomeoApp.services').factory('CollaboratorsService',
  ['DataService', 'AuthService', '$q',
  function (DataService, AuthService, $q) {

  'use strict';

  function addCollaborator (videoId, data) {
    var deferred = new $q.defer();

    DataService.request({
      url: '/api/video/' + videoId + '/collaborators',
      method: 'POST',
      data: data
    }).then(function (data) {
      console.log(data);
      deferred.resolve(data);
    }, function (response) {
      console.log(response);
      deferred.reject(response);
    });

    return deferred.promise;
  }

  function getCollaborators (videoId) {
    return DataService.request({
      url: '/api/video/' + videoId + '/collaborators'
    });
  }

  return ({
    addCollaborator : addCollaborator,
    getCollaborators : getCollaborators
  });

}]);


