(function () {

    'use strict';

    function tagService (DataService, VideoService, $rootScope, AccountService, $q, $timeout) {

      var Tag = {},
          Tags = null;

      /*
      * Make a GET request to the web service for all of the tags
      */
      Tag.getTags = function() {
          var deferred = new $q.defer();
          DataService.request({url: '/api/account/' + AccountService.getAccountId() + '/tags'}).then(function(response) {
              Tags = response.tag.items;
              deferred.resolve(response);
          });
          return deferred.promise;
      };

      Tag.getPublicTags = function() {
          var dfd = new $q.defer();
          DataService.request({url: '/api/account/' + AccountService.getAccountId() + '/tags'})
          .then(function(response) {
            console.log(response);
            var tags = response.tag.items;
            var l = tags.length;
            var publicTags = [];
            while (l--) {
              if (tags[l].public) {
                publicTags.push(tags[l]);
              }
            }
            dfd.resolve(publicTags);
          });
          return dfd.promise;
      };

      Tag.createTag = function(data){
          var deferred = new $q.defer();
          deferred.resolve(DataService.request({url: '/api/account/' + AccountService.getAccountId() + '/tags', method: 'POST', data: data}));
          return deferred.promise;
      };

      /*
      * Returns the label of a given ID
      */
      Tag.getLabel = function(id) {
          var deferred = new $q.defer();

          $timeout(function() {
              ng.forEach(Tags, function(value, key){
                  console.log('smashing through labels', id, value.id);
                  if ( value.id == id ) {
                      deferred.resolve(value.label);
                  }
              });
          });

          return deferred.promise;
      };

      Tag.updateTag = function (tag) {
        var url = '/api/tag/' + tag.id;
        return DataService.request({ url: url, method: 'PUT', data: tag });
      };

      Tag.deleteTag = function (id) {
        var url = '/api/tag/' + id;
        return DataService.request({ url: url, method: 'DELETE' });
      };

      /*
      * Expose the methods to the service
      */
      return Tag;
  }

  angular.module('RomeoApp.services').factory('TagService', ['DataService', 'VideoService', '$rootScope', 'AccountService', '$q', '$timeout', tagService]);

})();
