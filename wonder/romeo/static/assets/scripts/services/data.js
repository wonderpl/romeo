angular.module('RomeoApp.services')
  .factory('DataService', ['$http', '$q', '$location', 'AuthService', 'ErrorService', '$timeout',
    function ($http, $q, $location, AuthService, ErrorService, $timeout) {

  'use strict';

  var Data = {};

  /*
  * If the user is authorised to make a request, go for it!
  */
  Data.request = function(options) {
      var deferred = new $q.defer();

      AuthService.loginCheck().then(function(){

          $http(options).then(
          function(response){
            deferred.resolve(response.data);
          },
          function(response){
            deferred.reject(response);
          });

      }, function(){
          AuthService.redirect();
          deferred.reject();
      });

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