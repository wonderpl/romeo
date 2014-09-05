(function () {
    'use strict';

    function UserService(SecurityService, DataService, $http, $q) {
        var service = {};

        function formatConnection(connection) {
          var user = connection.collaborator || connection.user;
          user.type = connection.collaborator ? 'collaborator' : 'user';
          user.text = user.display_name || '';
          return user;
        }

        function formatConnections(connections) {
          var formattedConnections = [];
          var l = connections.length;
          while (l--) {
            var connection = connections[l];
            if (connection.collaborator || connection.user) {
              formattedConnections.push(formatConnection(connection));
            }
          }
          return formattedConnections;
        }

        // Used to send PATCH requests to the webservice, updating individual parts of the user account
        service.updateUser = function(data) {
            var url = '/api/user/' + SecurityService.getUser().id;
            var promise = DataService.request({url: url, method: 'PATCH', data: data });
            promise.then(function (res) {
              angular.extend(SecurityService.getUser(), angular.fromJson(res));
            });
            return promise;
        };

        // Send a PATCH request with an updated avatar image
        service.updateAvatar = function(data) {
            var promise = DataService.uploadImage( ('/api/user/' + SecurityService.getUser().id), 'avatar', data);
            promise.then(function (res) {
              SecurityService.getUser().avatar = angular.fromJson(res).avatar;
            });
            return promise;
        };

        // Send a PATCH request with an updated cover image
        service.updateCoverImage = function(data) {
          var promise = DataService.uploadImage( ('/api/user/' + SecurityService.getUser().id), 'profile_cover', data);
          promise.then(function (res) {
            SecurityService.getUser().profile_cover = angular.fromJson(res).profile_cover;
          });
          return promise;
        };

        service.getUser = function () {
            return SecurityService.getUser();
        };
        service.connect = function (data) {
          var url = '/api/user/' + service.getUser().id + '/connections';
          return DataService.request({ url: url, data: data, method: 'POST' });
        };

        service.getConnections = function (format) {
          var dfd = new $q.defer();
          var user = service.getUser();
          var url = '/api/user/' + user.id + '/connections';
          $http.get(url).success(function (data) {
            if (format) {
              dfd.resolve(formatConnections(data.connection.items));
            } else {
              dfd.resolve(data.connection.items);
            }
          });
          return dfd.promise;
        };

        service.getPublicUser = function (id) {
          return $http.get('/api/user/' + id + '?public');
        };

        service.getPublicConnections = function (id) {
          return $http.get('/api/user/' + id + '/connections?public');
        };

        return service;
    }
    angular.module('RomeoApp.services').factory('UserService', ['SecurityService', 'DataService', '$http', '$q', UserService]);

})();