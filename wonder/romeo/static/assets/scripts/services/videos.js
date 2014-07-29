
/*
* Methods for interacting with the Video web services
*/
angular.module('RomeoApp.services').factory('VideoService',
    ['DataService', 'localStorageService', '$rootScope', 'AuthService', '$q',
    function (DataService, localStorageService, $rootScope, AuthService, $q) {

    'use strict';

    var Video = {},
        Videos = {};

    Video.getPlayerParameters = function (id) {
      var url = '/api/video/' + id + '/player_parameters';
      return DataService.request({ url: url });
    };

    Video.setPlayerParameters = function (id, data) {
      var url = '/api/video/' + id + '/player_parameters';
      return DataService.request({ url: url, method: 'PUT', data: data });
    };

    Video.getEmbedCode = function (id, data) {
      // /api/video/<video_id>/embed_code?style=<style>&width=<width>&height=<height>
      var url = '/api/video/' + id + '/embed_code?style=' + data.style + '&width=' + data.height + '&height=' + data.height;
      return DataService.request({ url : url });
    };

    Video.getShareUrl = function (id, service) {
      var url = '/api/video/' + id + '/share_url?target=' + service;
      return DataService.request({ url : url });
    };

    /*
    * Returns a promise, which if resolves returns an array of all of the available video categories
    */
    Video.getCategories = function () {
        var url = '/api/categories';
        return DataService.request({url: url});
    };

    /*
    * Returns an object with Amazon S3 credentials that are required for uploading video files
    */
    Video.getUploadArgs = function () {
        var deferred = new $q.defer();
        AuthService.getSessionId().then(function(response){
            deferred.resolve(DataService.request({url: '/api/account/' + response + '/upload_args'}));
        });
        return deferred.promise;
    };

    /*
    * Ask the web service for the preview images for a specific video
    */
    Video.getPreviewImages = function (id) {
        var url = '/api/video/' + id + '/preview_images';
        return DataService.request({ url: url, method: 'GET'});
    };

    /*
    * Set a specific preview image to be used on a specific video
    */
    Video.setPreviewImage = function(id, data) {
        var url = '/api/video/' + id + '/primary_preview_image';
        return DataService.request({ url: url, method: 'PUT', data: data });
    };

    /*
    * Create a new video record - returns a promise, which if resolved contains the video id.
    */
    Video.create = function (data) {
        var deferred = new $q.defer();
        AuthService.getSessionId().then(function(response){
            deferred.resolve(DataService.request({url: '/api/account/' + response + '/videos', method: 'POST', data: data}));
        });
        return deferred.promise;
    };

    /*
    * Update a specific video record ( PATCH )
    */
    Video.update = function (id, data) {
        var url = '/api/video/' + id + '';
        data.link_url = data.link_url || '';
        return DataService.request({ url: url, method: 'PATCH', data: data });
    };

    Video.delete = function (id) {
        var url = '/api/video/' + id;
        return DataService.request({ url: url, method: 'DELETE' });
    };

    /*
    * Upload a custom logo to be used for the embedded player for this video
    */
    Video.saveCustomLogo = function (id, file) {

        var deferred = new $q.defer(),
            formData = new FormData();

        formData.append('player_logo', file);
        $.ajax({
            url: '/api/video/' + id,
            type: 'PATCH',
            data: formData,
            processData: false,
            mimeType: 'multipart/form-data',
            contentType: false
        }).done(function (response) {
            return deferred.resolve(response);
        });

        return deferred.promise;
    };

    Video.saveCustomPreview = function (id, file) {

        var deferred = new $q.defer(),
            formData = new FormData();

        formData.append('cover_image', file);
        $.ajax({
            url: '/api/video/' + id,
            type: 'PATCH',
            data: formData,
            processData: false,
            mimeType: 'multipart/form-data',
            contentType: false
        }).done(function (response) {
            return deferred.resolve(response);
        });

        return deferred.promise;
    };

    /*
    * Get a specific video from the web service
    */
    Video.get = function(id) {
        var url = '/api/video/' + id + '';
        return DataService.request({ url: url, method: 'GET'});
    };

    /*
    * Get all of the videos from the web service for the user who is currently logged in.
    */
    Video.getAll = function() {
        var deferred = new $q.defer();
        AuthService.getSessionId().then(function(response){
            DataService.request({ url: '/api/account/' + response + '/videos', method: 'GET'}).then(function(response){

                Videos = response.video.items;
                $rootScope.Videos = response.video.items;

                deferred.resolve(response);
            });
        });
        return deferred.promise;
    };

    Video.isOwner = function (videoId) {
      var deferred = new $q.defer();
      AuthService.getSessionId().then(function(response){
        DataService.request({ url: '/api/account/' + response + '/videos', method: 'GET'}).then(function(response){
          var videos = response.video.items;
          var l = videos.length;
          while (l--) {
            if (videos[l].id === videoId) {
              deferred.resolve({
                isOwner : true
              });
            }
          }
          deferred.resolve({
            isOwner : false
          });
        }, function () {
          deferred.reject(response);
        });
      }, function () {
        deferred.reject();
      });

      return deferred.promise;
    };

    /*
    * Add a video to a collection
    */
    Video.addToCollection = function(video, tag) {
        var url = '/api/video/' + video + '/tags';
        return DataService.request({ url: url, method: 'POST', data: { id: tag } });
    };

    /*
    * Remove a video from a collection
    */
    Video.removeFromCollection = function(video, tag) {
      var url = '/api/video/' + video + '/tags/' + tag;
      return DataService.request({ url: url, method: 'DELETE' });
    };

    Video.getOne = function(id) {
        var deferred = new $q.defer();
        DataService.request({ url: '/api/video/' + id + '', method: 'GET'}).then(function(response){
            deferred.resolve(response);
        });
        return deferred.promise;
    };

    Video.hasTag = function (tagId, video) {
      var hasTag = false;
      if (video && video.tags && video.tags.items) {
        var l = video.tags.items.length;
        var tags = video.tags.items;
        while (l--) {
          if (tags[l].id === tagId) {
            hasTag = true;
          }
        }
      }
      return hasTag;
    };

    Video.getDownloadUrl = function (videoId) {
        return DataService.request({ url: '/api/video/' + videoId + '/download_url', method: 'GET'});
    };

    /*
    * Initialise the service
    */
    Video.getAll();

    /*
    * Expose the methods to the service
    */
    return {
        getDownloadUrl: Video.getDownloadUrl,
        getPlayerParameters: Video.getPlayerParameters,
        setPlayerParameters: Video.setPlayerParameters,
        getEmbedCode: Video.getEmbedCode,
        getShareUrl: Video.getShareUrl,
        getCategories: Video.getCategories,
        getUploadArgs: Video.getUploadArgs,
        getPreviewImages: Video.getPreviewImages,
        setPreviewImage: Video.setPreviewImage,
        create: Video.create,
        update: Video.update,
        delete: Video.delete,
        get: Video.get,
        getAll: Video.getAll,
        isOwner: Video.isOwner,
        getOne: Video.getOne,
        addToCollection: Video.addToCollection,
        removeFromCollection: Video.removeFromCollection,
        saveCustomPreview: Video.saveCustomPreview,
        hasTag: Video.hasTag
    };
}]);
