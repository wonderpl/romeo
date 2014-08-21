/*  Romeo Services
 /* ================================== */

(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [] /* module dependencies */);

    /*
    * Strips out newlines, tabs etc
    */
    app.factory('$sanitize', [function () {
        return function (input) {
            return input.replace('\n', '').replace('\t', '').replace('\r', '').replace(/^\s+/g, '');
        };
    }]);

    /*
    * This service does the heavy lifting of actually making requests to the web services.
    */
    app.factory('DataService',
        ['$http', '$q', '$location', 'AuthService', 'ErrorService', '$timeout',
        function ($http, $q, $location, AuthService, ErrorService, $timeout) {

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

        return {
            request: Data.request,
            uploadImage: Data.uploadImage
        };

    }]);

    app.factory('ErrorService', function () {

        function AuthError() {
            var tmp = Error.apply(this, arguments);
            tmp.name = this.name = 'AuthError';

            this.stack = tmp.stack;
            this.message = tmp.message;

            return this;
        }

        AuthError.prototype = Object.create(Error);

        return {
            AuthError: AuthError
        };
    });

})(window, document, window.angular, 'RomeoApp', 'services');
