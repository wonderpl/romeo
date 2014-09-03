(function(){

  angular.module('RomeoApp.services').factory('CollaboratorsService',
    ['$http', function ($http) {

    'use strict';

    var service = {};

    service.addCollaborators = function (videoId, data) {
      var users = [];
      var url = '/api/video/' + videoId + '/collaborators';
      var collaborators = [];
      var l = data.collaborators.length;
      var can_download = !!(data.permissions.canDownload || data.permissions.canCommentDownload);
      var can_comment = !!(data.permissions.canComment || data.permissions.canCommentDownload);
      while (l--) {
        var collaborator = data.collaborators[l];
        var user = {};
        user.name = collaborator.text || collaborator.email;
        user.email = collaborator.email || collaborator.text;
        user.can_download = can_download;
        user.can_comment = can_comment;
        users.push(user);
      }
      return $http.post(url, users);

    };

    service.getCollaborators = function (videoId) {
      var url = '/api/video/' + videoId + '/collaborators';
      return $http.get(url);
    };

    return service;

  }]);

})();
