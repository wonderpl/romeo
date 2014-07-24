/*
* Methods for interacting with the Tag web services
*/

angular.module('RomeoApp.services').factory('TagService',
    ['DataService', 'VideoService', '$rootScope', 'AuthService', '$q', '$timeout',
    function (DataService, VideoService, $rootScope, AuthService, $q, $timeout) {

    'use strict';

    var Tag = {},
        Tags = null;

    /*
    * Make a GET request to the web service for all of the tags
    */
    Tag.getTags = function() {
        var deferred = new $q.defer();
            AuthService.getSessionId().then(function(response){
                DataService.request({url: '/api/account/' + response + '/tags'}).then(function(response){
                    $rootScope.Tags = response.tag.items;
                    Tags = response.tag.items;
                    deferred.resolve(response);
                });
            });
        return deferred.promise;
    };

    Tag.createTag = function(data){
        var deferred = new $q.defer();
            AuthService.getSessionId().then(function(response){
                deferred.resolve(DataService.request({url: '/api/account/' + response + '/tags', method: 'POST', data: data}));
            });
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
    return {
        getTags   : Tag.getTags,
        createTag : Tag.createTag,
        getLabel  : Tag.getLabel,
        updateTag : Tag.updateTag,
        deleteTag : Tag.deleteTag
    };
}]);