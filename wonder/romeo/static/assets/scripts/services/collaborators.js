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
    AuthService.getSessionId().then(function(response){
      deferred.resolve(DataService.request({
        url: '/api/video/' + videoId + '/collaborators',
        method: 'POST',
        data: data
      }));
    });
    return deferred.promise;
  }

  return ({
    addCollaborator : addCollaborator
  });

}]);


