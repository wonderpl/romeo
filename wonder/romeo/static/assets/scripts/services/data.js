angular.module('RomeoApp.services')
  .factory('DataService', ['$http', '$q', '$location', 'SecurityService', 'ErrorService',
    function ($http, $q, $location, SecurityService, ErrorService) {

  'use strict';

  var Data = {};

  /*
  * If the user is authorised to make a request, go for it!
  */
  Data.request = function(options) {
      var deferred = new $q.defer();

      if (SecurityService.isAuthenticated()){

          $http(options).then(
          function(response){
            deferred.resolve(response.data);
          },
          function(response){
            deferred.reject(response);
          });

      }
      else {
          SecurityService.redirect();
          deferred.reject();
      }

      return deferred.promise;
  };

  /*
  * Make a patch request with some image data
  */
  Data.uploadImage = function(url, fieldname, data) {

      var deferred = new $q.defer(),
          formData = new FormData();

      formData.append(fieldname, data);

      var onprogress = function() {
          var xhr = $.ajaxSettings.xhr();
          xhr.upload.onprogress = function (e) {
              var p = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
              deferred.notify(p);
          };
          return xhr;
      };

      $.ajax({
          url: url,
          type: 'PATCH',
          data: formData,
          processData: false,
          mimeType: 'multipart/form-data',
          contentType: false
          // , xhr: onprogress
      }).done(function (response) {
          deferred.resolve(response);
      }).fail(function(response){
          deferred.reject(response);
      });

      return deferred.promise;
  };

  return Data;

}]);