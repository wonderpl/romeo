/*  Romeo Services
 /* ================================== */

(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [] /* module dependencies */);

    app.factory('$sanitize', [function () {
        return function (input) {
            return input.replace('\n', '').replace('\t', '').replace('\r', '').replace(/^\s+/g, '');
        };
    }]);

    app.factory('prettydate', [function(){

        return function(date_str){
            var time_formats = [
                [60, 'Just Now'],
                [90, '1 Minute'], // 60*1.5
                [3600, 'Minutes', 60], // 60*60, 60
                [5400, '1 Hour'], // 60*60*1.5
                [86400, 'Hours', 3600], // 60*60*24, 60*60
                [129600, '1 Day'], // 60*60*24*1.5
                [604800, 'Days', 86400], // 60*60*24*7, 60*60*24
                [907200, '1 Week'], // 60*60*24*7*1.5
                [2628000, 'Weeks', 604800], // 60*60*24*(365/12), 60*60*24*7
                [3942000, '1 Month'], // 60*60*24*(365/12)*1.5
                [31536000, 'Months', 2628000], // 60*60*24*365, 60*60*24*(365/12)
                [47304000, '1 Year'], // 60*60*24*365*1.5
                [3153600000, 'Years', 31536000], // 60*60*24*365*100, 60*60*24*365
                [4730400000, '1 Century'], // 60*60*24*365*100*1.5
            ];

            var time = ('' + date_str).replace(/-/g,"/").replace(/[TZ]/g," "),
                dt = new Date,
                seconds = ((dt - new Date(time) + (dt.getTimezoneOffset() * 60000)) / 1000),
                token = ' Ago',
                i = 0,
                format;

            if (seconds < 0) {
                seconds = Math.abs(seconds);
                token = '';
            }

            while (format = time_formats[i++]) {
                if (seconds < format[0]) {
                    if (format.length == 2) {
                        return format[1] + (i > 1 ? token : ''); // Conditional so we don't return Just Now Ago
                    } else {
                        return Math.round(seconds / format[2]) + ' ' + format[1] + (i > 1 ? token : '');
                    }
                }
            }

            // overflow for centuries
            if(seconds > 4730400000)
                return Math.round(seconds / 4730400000) + ' Centuries' + token;

            return date_str;
        };

    }]);

    app.factory('$modal', ['$rootScope', '$compile', '$sanitize', '$templateCache', function ($rootScope, $compile, $sanitize, $templateCache) {

        var modal = {},
            el = d.createElement('div'),
            $el,
            el_bg = d.createElement('div'),
            $el_bg,
            b = d.body || d.documentElement,
            template,
            compiledTemplate,
            urlCache = {};

        el_bg.setAttribute('id', 'modal-bg');
        b.appendChild(el_bg);
        $el_bg = ng.element(el_bg);

        el.setAttribute('id', 'modal');
        b.appendChild(el);
        $el = ng.element(el);

        $el_bg.bind('click', function (event) {
            modal.hide();
        });

        modal.show = function ( opts ) {
            $el_bg.addClass('show');
            $el.addClass('show');
        };

        modal.hide = function () {
            $el_bg.removeClass('show');
            $el.removeClass('show');
            $el.attr('style','');
        };

        modal.toggle = function () {
            $el_bg.toggleClass('show');
            $el.toggleClass('show');
        };

        // Load a modal template and SHOW it ( optional )
        modal.load = function (url, show, scope, obj, opts) {

            if ( opts && 'width' in opts ) {
                $el.css('width', opts.width + 'px');
            }

            template = $templateCache.get(modal.getUrl(url));
            if ( obj !== undefined ) {
                var $scp = ng.extend(scope.$new(), {
                    data: ng.extend({}, obj)
                });
                compiledTemplate = $compile($sanitize(template))($scp);                
            } else {
                compiledTemplate = $compile($sanitize(template))(scope);
            }

            $el.html('');
            $el.append(compiledTemplate);

            if (show === true) {
                $el_bg.addClass('show');
                $el.addClass('show');
            }
        };

        // Check if we have the URL cached
        modal.getUrl = function (url) {
            if (urlCache[url] === undefined) {
                return url;
            } else {
                return urlCache[url];
            }
        };

        // Expose our public methods
        return {
            show: modal.show,
            hide: modal.hide,
            toggle: modal.toggle,
            load: modal.load
        };

    }]);

    app.factory('$tooltip', [function () {

        var el = d.createElement('div'),
            $el,
            text = d.createElement('span'),
            $text,
            b = d.body || d.documentElement,
            $b;

        el.setAttribute('id', 'tooltip');

        el.appendChild(text);
        b.appendChild(el);

        $b = ng.element(b);
        $el = ng.element(el);

        var Tooltip = {};

        Tooltip.show = function (txt, el) {
            if ('getBoundingClientRect' in el) {
                text.innerHTML = txt;

                var targetpos = el.getBoundingClientRect(),
                    elpos = $el[0].getBoundingClientRect();

                $el.css({
                    top: (targetpos.top - 32) + 'px',
                    left: ((targetpos.left + (targetpos.width / 2)) - (elpos.width / 2)) + 'px'
                });

                $el.addClass('show');
            }
        };

        Tooltip.hide = function () {
            console.log('tooltip hidden');
            $el.removeClass('show');
        };

        return {
            show: Tooltip.show,
            hide: Tooltip.hide
        };
    }]);

    app.factory('StatsService', ['DataService', function (DataService) {

        var Stats;
        var apiUrl = '/static/api/stats.json';
        var fields = [
            {
                'field': 'plays',
                'displayName': 'Total Plays',
                'description': 'Number of plays since beginning of time period',
                'visible': true,
                'color': '#7cd26f'
            },
            {
                'field': 'daily_uniq_plays',
                'displayName': 'Daily Unique Plays',
                'visible': true,
                'description': 'Number of unique plays since beginning of time period',
                'color': '#8b85d0'
            },
            {
                'field': 'monthly_uniq_plays',
                'displayName': 'Monthly Unique Plays',
                'visible': false,
                'description': 'Number of unique plays plays since beginning of time period',
                'color': '#5bccf6'
            },
            {
                'field': 'weekly_uniq_plays',
                'displayName': 'Weekly Unique Plays',
                'visible': false,
                'description': 'Number of unique plays plays since beginning of time period',
                'color': '#e25f5c'
            },
            {
                'field': 'playthrough_25',
                'displayName': 'Playthrough > 25%',
                'visible': false,
                'description': 'Number of plays to 25% since beginning of time period',
                'color': '#8b85d0'
            },
            {
                'field': 'playthrough_50',
                'displayName': 'Playthrough > 50%',
                'visible': false,
                'description': 'Number of plays to 50% since beginning of time period',
                'color': '#4becd3'
            },
            {
                'field': 'playthrough_75',
                'displayName': 'Playthrough > 75%',
                'visible': false,
                'description': 'Number of plays to 75% since beginning of time period',
                'color': '#ffec4a'
            },
            {
                'field': 'playthrough_100',
                'displayName': 'Playthrough > 100%',
                'visible': false,
                'description': 'Number of plays to 100% since beginning of time period',
                'color': '#f38bef'
            }
        ];

        Stats = {
            getOne: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request({url: url});
            },
            getAll: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request({url: url});
            },
            query: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request({url: url});
            },
            getFields: function () {
                return fields;
            }
        };

        return Stats;

    }]);

    app.factory('AnalyticsFields', function () {
        return [
            {
                'field': 'plays',
                'displayName': 'Total Plays',
                'description': 'Number of plays since beginning of time period',
                'visible': true,
                'color': '#7cd26f'
            },
            {
                'field': 'daily_uniq_plays',
                'displayName': 'Daily Unique Plays',
                'visible': true,
                'description': 'Number of unique plays since beginning of time period',
                'color': '#8b85d0'
            },
            {
                'field': 'monthly_uniq_plays',
                'displayName': 'Monthly Unique Plays',
                'visible': false,
                'description': 'Number of unique plays plays since beginning of time period',
                'color': '#5bccf6'
            },
            {
                'field': 'weekly_uniq_plays',
                'displayName': 'Weekly Unique Plays',
                'visible': false,
                'description': 'Number of unique plays plays since beginning of time period',
                'color': '#e25f5c'
            },
            {
                'field': 'playthrough_25',
                'displayName': 'Playthrough > 25%',
                'visible': false,
                'description': 'Number of plays to 25% since beginning of time period',
                'color': '#8b85d0'
            },
            {
                'field': 'playthrough_50',
                'displayName': 'Playthrough > 50%',
                'visible': false,
                'description': 'Number of plays to 50% since beginning of time period',
                'color': '#4becd3'
            },
            {
                'field': 'playthrough_75',
                'displayName': 'Playthrough > 75%',
                'visible': false,
                'description': 'Number of plays to 75% since beginning of time period',
                'color': '#ffec4a'
            },
            {
                'field': 'playthrough_100',
                'displayName': 'Playthrough > 100%',
                'visible': false,
                'description': 'Number of plays to 100% since beginning of time period',
                'color': '#f38bef'
            }
        ];
    });

    app.factory('OverviewService', ['DataService', function (DataService) {

        return {
            get: function (videoId, fromDate, toDate) {

                var url = _.template('/static/api/stats.json', {id: videoId });
                var params = { start: fromDate, end: toDate };
                return DataService.request({
                    url: url,
                    params: params
                }).then(function (data) {
                    return data.overview;
                });

            }
        };

    }]);

    app.factory('PerformanceService', ['DataService', function (DataService) {

        return {
            get: function (videoId, fromDate, toDate) {

                var url = _.template('/api/video/${ id }/analytics/performance', {id: videoId });
                var formatdate = function (date) {
                    return moment(date).format('YYYY-MM-DD');
                };

//                var url = _.template('/static/api/performance.json', {id: videoId });
                var params = {start: formatdate(fromDate), end: formatdate(toDate), breakdown_by: 'day' };
                return DataService.request({
                    url: url,
                    params: params
                }).then(function (data) {
                    return data.metrics;
                });

            }
        };

    }]);

    app.factory('GeographicService', ['DataService', function (DataService) {

        return {
            get: function (videoId, selectedRegion, fromDate, toDate) {

//                var url = _.template('/api/video/${ id }/analytics/performance', {id: videoId });
                var url = _.template('/api/video/${ id }/analytics/country${ selectedRegionId }', {id: videoId, selectedRegionId: selectedRegion.name.match(/world/i) ? '' : '/' + selectedRegion.regionId });
                var formatdate = function (date) {
                    return moment(date).format('YYYY-MM-DD');
                };

                var params = {start: formatdate(fromDate), end: formatdate(toDate), breakdown_by: 'day' };
                return DataService.request({url: url, params: params}).then(function (data) {
                    return data.metrics;
                });

            },
            getMap: function (selectedRegion) {

                var url = _.template('/static/api/maps/${ selectedRegion }.json', {selectedRegion: selectedRegion.name.toLowerCase() });
                return DataService.request({url: url});

            }
        };
    }]);
    app.factory('EngagementService', ['DataService', function (DataService) {

        return {
            get: function (videoId, selectedRegion, fromDate, toDate) {

                var url = '/static/api/stats.json';
//                var url = _.template('/static/api/video/${ id }/analytics/country${ selectedRegionId }', {id: videoId, selectedRegionId: selectedRegion.name.match(/world/i) ? '' : '/' + selectedRegion.regionId });
                var formatdate = function (date) {
                    return moment(date).format('YYYY-MM-DD');
                };

                var params = {start: formatdate(fromDate), end: formatdate(toDate), breakdown_by: 'day' };
                return DataService.request({url: url, params: params}).then(function (data) {
                    return data.engagement.results[0].metrics;
                });

            }
        };

    }]);


    /*
    * Methods for interacting with the Video web services
    */
    app.factory('VideoService', 
        ['DataService', 'localStorageService', '$rootScope', 'AuthService', '$q', 
        function (DataService, localStorageService, $rootScope, AuthService, $q) {

        var Video = {},
            Videos = {};

        /*
        * Returns a promise, which if resolves returns an array of all of the available video categories
        */
        Video.getCategories = function () {
            var url = '/api/categories';
            console.log('DataService about to be called on:', url);
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
            console.log('get preview images called on video id', id);
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
            return DataService.request({ url: url, method: 'PATCH', data: data });
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

        /*
        * Get a specific video from the web service
        */
        Video.get = function(id) {
            console.log('video GET called');
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
                    // $rootScope.$broadcast('videos updated', response);
                    console.log(response.video.items);
                    Videos = response.video.items;
                    $rootScope.Videos = response.video.items;
                });
            });
            return deferred.promise;
        };


        Video.getAll();

        return {
            getCategories: Video.getCategories,
            getUploadArgs: Video.getUploadArgs,
            getPreviewImages: Video.getPreviewImages,
            setPreviewImage: Video.setPreviewImage,
            create: Video.create,
            update: Video.update,
            get: Video.get,
            getAll: Video.getAll
        };
    }]);

    /*
    * Methods for interacting with the Account web services
    */
    app.factory('AccountService', 
        ['DataService', 'localStorageService', '$rootScope', 'AuthService', '$q', '$timeout', 
        function (DataService, localStorageService, $rootScope, AuthService, $q, $timeout) {

        var Account = {},
            User = null,
            ID = null;

        /*
        * Returns a promise, which if resolved returns the User object from the web service.
        */
        Account.getUser = function() {
            var deferred = new $q.defer();
            
            if ( ID === null ) {
                AuthService.getSessionId().then(function(response){
                    ID = response;
                    DataService.request({url: ('/api/account/' + ID)}).then(function(response){
                        User = response;
                        $rootScope.User = response;
                        // $rootScope.$broadcast('user updated', response);
                        deferred.resolve(response);
                    });
                });
            } else {
                DataService.request({url: ('/api/account/' + ID)}).then(function(response){
                    console.log('User added to rootscope');
                    User = response;
                    $rootScope.User = response;
                    // $rootScope.$broadcast('user updated', response);
                    deferred.resolve(response);
                });
            }
            return deferred.promise;
        };

        /*
        * Used to send PATCH requests to the webservice, updating individual parts of the user account
        */
        Account.updateUser = function(data) {
            var url = '/api/account/' + ID;
            return DataService.request({url: url, method: 'PATCH', data: data });
        };

        Account.updateCoverImage = function(data) {
            return DataService.uploadImage( ('/api/account/' + ID), 'profile_cover', data);
        };

        Account.updateAvatar = function(data) {
            return DataService.uploadImage( ('/api/account/' + ID), 'avatar', data);
        };

        Account.getUser().then(function(response){
            console.log('Account Service initialised');
        });

        return {
            getUser: Account.getUser,
            updateUser: Account.updateUser,
            updateCoverImage: Account.updateCoverImage,
            updateAvatar: Account.updateAvatar,
            User: User
        };
    }]);

    /*
    * Methods for logging in and out, and for accessing credentials used by the other services
    */
    app.factory('AuthService', 
        ['$rootScope', '$http', 'localStorageService', 'ErrorService', '$timeout', '$q', '$interval', '$location',
        function ($rootScope, $http, localStorageService, ErrorService, $timeout, $q, $interval, $location) {

        var Auth = {},
            session = null,
            loggedIn = false;

        /*
        * POSTS the users login credentials to the server.  If successful, we add the session url to local storage.
        */
        Auth.login = function(username, password){
            return $http({
                method: 'post',
                url: '/api/login',
                data: {
                    'username': username,
                    'password': password
                }
            }).success(function (data) {
                console.log('login response', data);
                return Auth.setSession(data.account);
            }).error(function () {
                // debugger;
            });
        };

        /*
        * Returns a BOOLEAN.  If there is no session url in local storage, we aren't letting them in.
        */
        Auth.isLoggedIn = function() {
            return loggedIn;
        };

        /*
        * Returns a PROMISE.  Checks if the user is logged in.  
        * First we check if the user has a session url in local storage
        * Second we check if we get a valid response when we try and communicated
        */
        Auth.loginCheck = function() {
            var deferred = new $q.defer();
            $timeout(function(){
                if ( loggedIn === true ) {
                    deferred.resolve();
                } else {
                    Auth.getSession().then(function(response){
                        $http({method: 'GET', url: (response.href || response) }).then(function(response){
                            loggedIn = true;
                            $rootScope.isLoggedIn = true;
                            deferred.resolve();
                        }, function(response){
                            loggedIn = false;
                            $rootScope.isLoggedIn = false;
                            deferred.reject('not logged in');
                        });
                    }, function(){
                        deferred.reject('not logged in');
                    });    
                }
            });
            return deferred.promise;
        };

        /*
        * Adds the session url to local storage
        */
        Auth.setSession = function(sessionData) {
            localStorageService.add('session_url', sessionData.href);
            session = sessionData.href;
            return session;
        };

        /*
        * returns a BOOLEAN.  If there is no session url in local storage, we aren't letting them in.
        */
        Auth.getSession = function() {
            var deferred = new $q.defer();

            $timeout(function() {
                if ( session !== null ) {
                    deferred.resolve(session.account || session);
                } else if ( localStorageService.get('session_url') !== null ) {
                    deferred.resolve(localStorageService.get('session_url'));
                } else {
                    deferred.reject('no session');
                }
            });

            return deferred.promise;
        };

        /*
        * Try to pick out the ID from the session url
        */
        Auth.getSessionId = function() {
            var deferred = new $q.defer();
            Auth.getSession().then(function(response){
                deferred.resolve(response.match(/api\/account\/(\d+)/)[1]);
            }, function(response){
                deferred.reject('not logged in');
            });
            return deferred.promise;
        };

        /*
        * Redirects the user to the login page
        */
        Auth.redirect = function() {
            $location.path('/login');
        };

        return {
            login: Auth.login,
            isLoggedIn: Auth.isLoggedIn,
            loginCheck: Auth.loginCheck,
            setSession: Auth.setSession,
            getSession: Auth.getSession,
            getSessionId: Auth.getSessionId,
            redirect: Auth.redirect
        }

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
                
                $http(options).then(function(response){
                    deferred.resolve(response.data);
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

    // app.factory('DataService', ['$http', '$q', '$location', 'AuthService', 'ErrorService', function ($http, $q, $location, AuthService, ErrorService) {

    //     var Data;

    //     function request(options) {

    //         var deferred;
    //         var sessionUrl = AuthService.getSession();
    //         var defaultOptions = {
    //             method: 'GET'
    //         };

    //         options = _.extend(defaultOptions, options);

    //         if (AuthService.isLoggedIn()) {
    //             // We are logged in - make the actual request
    //             deferred = $http(options).then(function (response) {
    //                 return response.data;
    //             });
    //         } else if (sessionUrl) {
    //             deferred = AuthService.retrieveSession(sessionUrl).then(function (sessionData) {
    //                 AuthService.setSession(sessionData);
    //                 return $http(options).then(function (response) {
    //                     return response.data;
    //                 });
    //             }, function (error) {
    //                 return $q.reject(error);
    //             });
    //         } else {
    //             // No idea who this person is...
    //             deferred = $q.reject(new ErrorService.AuthError('no_session'));
    //         }

    //         deferred.catch(function (response) {
    //             if (typeof response === 'object') {
    //                 if (response instanceof ErrorService.AuthError) {
    //                     AuthService.logout();
    //                     $location.url('/login');
    //                 } else if ('status' in response && (response.status === 401)) {
    //                     return AuthService.retrieveSession(sessionUrl).then(function (sessionData) {
    //                         AuthService.setSession(sessionData);
    //                         return $http(options).then(function (response) {
    //                             return response.data;
    //                         });
    //                     }, function (error) {
    //                         $location.url('/login');
    //                     });
    //                 }
    //             }
    //             return arguments;
    //         });

    //         return deferred;
    //     }

    //     Data = {
    //         request: request
    //     };

    //     return Data;

    // }]);


    app.factory('ErrorService', function () {

        function AuthError() {
            var tmp = Error.apply(this, arguments);
            tmp.name = this.name = 'AuthError';

            this.stack = tmp.stack;
            this.message = tmp.message;

            return this
        }

        AuthError.prototype = Object.create(Error);

        return {
            AuthError: AuthError
        }

    });


    // app.factory('AuthService', 
    //     ['$http', 'localStorageService', 'ErrorService', '$timeout', '$q', '$interval', 
    //     function ($http, localStorageService, ErrorService, $timeout, $q, $interval) {
    //     var currentSession = null,
    //         checkInterval;

    //     var AuthService = {

    //         // Checks local storage for session and returns it
    //         getSession: function () {
    //             return localStorageService.get('session_url');
    //         },

    //         // Sets the session info
    //         setSession: function (sessionData) {
    //             localStorageService.add('session_url', sessionData.href);
    //             currentSession = sessionData;
    //             currentSession.id = sessionData.href.match(/api\/account\/(\d+)/)[1];
    //             return currentSession;
    //         },

    //         // Attempts to retrieve session info from server
    //         retrieveSession: function (session_url) {
    //             return $http({
    //                 method: 'GET',
    //                 url: session_url,
    //                 withCredentials: true
    //             }).then(function (data) {
    //                 return data.data;
    //             });
    //         },

    //         isLoggedIn: function () {
    //             return AuthService.getSession() != null;
    //         },

    //         login: function (username, password) {
    //             return $http({
    //                 method: 'post',
    //                 url: '/api/login',
    //                 data: {
    //                     'username': username,
    //                     'password': password
    //                 }
    //             }).success(function (data) {
    //                 return AuthService.setSession(data.account);
    //             }).error(function () {
    //                 // debugger;
    //             });
    //         },

    //         logout: function () {
    //             // Maybe a request here? probably....
    //             var deferred = $q.defer;
    //             currentSession = null;
    //             localStorageService.remove('session_url');
    //             deferred.resolve();
    //             return deferred.promise;
    //         },

    //         getUser: function () {

    //             var deferred = new $q.defer();

    //             // if ( currentSession === null ) {
    //             //     var deferred = new $q.defer();

    //             //     $timeout(function(){
    //             //         checkInterval = $interval(function(){
    //             //             console.log('interval firing', currentSession);
    //             //             if ( currentSession !== null ) {
    //             //                 $interval.cancel(checkInterval);
    //             //                 deferred.resolve(currentSession);
    //             //             }
    //             //         }, 200 );
    //             //     });

    //             //     return deferred.promise;
    //             // } else {

    //             // }

    //             $timeout(function() {
    //                 deferred.resolve(currentSession);
    //             });

    //             return deferred.promise;

    //         }, 
    //         getUserId: function() {
    //             if ( currentSession === null ) {
    //                 $timeout(function(){
    //                     return currentSession.id;
    //                 }, 6000);
    //             } else {
    //                 return currentSession.id;
    //             }
    //         }
    //     };
    //     return AuthService;
    // }]);

    app.factory('FlashService', [ '$timeout', function ($timeout) {

        var wrapper = d.createElement('ul'),
            $wrapper,
            b = d.body || d.documentElement,
            $b;

        $b = ng.element(b);
        wrapper.setAttribute('id', 'flash-wrapper');
        $b.append(wrapper);
        $wrapper = ng.element(wrapper);

        var Flash = function (msg, type) {
            var flash = d.createElement('li'),
                text = d.createElement('span');

            flash.className = type;
            text.className = 'icon-flash-' + type;
            text.innerHTML = msg;
            flash.appendChild(text);
            $wrapper.append(flash);

            $timeout(function () {
                flash.className += ' show';
            }, 10);

            $timeout(function () {
                flash.className += ' fade';
            }, 3000);

            $timeout(function () {
                wrapper.removeChild(flash);
            }, 4000);
        };

        return {
            flash: function (msg, type) {
                return new Flash(msg, type);
            }
        }
    }]);

    app.factory('DragDropService', [ 'animLoop', '$rootScope', function (animLoop, $rootScope) {

        var ghost = d.createElement('div'),
            b = d.body || d.documentElement,
            dragOrigin = {},
            dragging = false,
            dragElemId = null,
            tags = [],
            dropSuccess = false,
            debounceMouse = {},
            $ghost,
            $b,
            x,
            y;

        $b = ng.element(b);

        // Bind some listeners to the body
        $b.bind('mousemove', function (e) {
            debounceMouse = e;
        });

        $b.bind('mouseup', function (e) {
            if (dropSuccess === true) {
                dropSuccess = false;
            } else {
                dragCancel(dragElemId);
            }
        });

        // Initialise our UI element
        ghost.setAttribute('id', 'ghost');
        b.appendChild(ghost);
        $ghost = ng.element(ghost);

        var showGhost = function () {
            $ghost.addClass('show');
        };

        var hideGhost = function () {
            $ghost.removeClass('show');
        };

        var moveGhost = function () {
            $ghost.css({
                'left': x + 'px',
                'top': y + 'px'
            });
        };

        var dragStart = function (id) {
            dragElemId = id;
            $rootScope.$broadcast('dragStarted', id);
            dragOrigin = {
                x: x,
                y: y
            };
            start();
        };

        var dragCancel = function (id) {
            dragging = false;
            $rootScope.$broadcast('dragCancelled', id);
            stop();
        };

        var dragDrop = function (id) {
            dropSuccess = true;
            $rootScope.$broadcast('dragDropped', id);
            dragging = false;
            stop();
            tags = [];
        };

        var isDragging = function () {
            return dragging;
        };

        var start = function () {
            dragging = true;
            $ghost.addClass('show');
            // animLoop.add('moveghost', moveGhost);
        };

        var stop = function () {
            $ghost.removeClass('show');
            // animLoop.remove('moveghost');
            hideGhost();
        };

        var setTags = function (newTags) {
            $ghost.html('');
            tags = [];
            for (var i = 0; i < newTags.length; i++) {
                tags[i] = d.createElement('div');
                tags[i].className = 'tag';
                tags[i].innerHTML = newTags[i];
                $ghost.append(tags[i]);
            }
        };

        var updateMouse = function (e) {
            x = e.pageX;
            y = e.pageY;
        };

        animLoop.add('debounceMouse', function () {
            updateMouse(debounceMouse);
        });
        animLoop.add('moveghost', moveGhost);
        animLoop.start();

        return {
            dragStart: dragStart,
            dragCancel: dragCancel,
            dragDrop: dragDrop,
            isDragging: isDragging,
            setTags: setTags
        };
    }]);

    app.factory('animLoop', function () {

        var rafLast = 0;

        var requestAnimFrame = (function () {
            return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - rafLast));
                    var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    rafLast = currTime + timeToCall;
                    return id;
                };
        })();

        var cancelAnimFrame = (function () {
            return  window.cancelAnimationFrame ||
                window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                function (id) {
                    clearTimeout(id);
                };
        })();

        var FramePipeline = function () {
            var _t = this;
            _t.pipeline = {};
            _t.then = new Date().getTime();
            _t.now = undefined;
            _t.raf = undefined;
            _t.delta = undefined;
            _t.interval = 1000 / 60;
            _t.running = false;
        };

        FramePipeline.prototype = {
            add: function (name, fn) {
                this.pipeline[name] = fn;
            },
            remove: function (name) {
                delete this.pipeline[name];
            },
            start: function () {
                if (!this.running) {
                    this._tick();
                    this.running = true;
                }
            },
            pause: function () {
                if (this.running) {
                    cancelAnimFrame.call(window, this.raf);
                    this.running = false;
                }
            },
            setFPS: function (fps) {
                this.interval = 1000 / fps;
            },
            _tick: function tick() {
                var _t = this;
                _t.raf = requestAnimFrame.call(window, tick.bind(_t));
                _t.now = new Date().getTime();
                _t.delta = _t.now - _t.then;
                if (_t.delta > _t.interval) {
                    for (var n in _t.pipeline) {
                        _t.pipeline[n]();
                    }
                    _t.then = _t.now - (_t.delta % _t.interval);
                }
            }
        };

        var pipeline = new FramePipeline();

        Function.prototype.bind = Function.prototype.bind || function () {
            return function (context) {
                var fn = this,
                    args = Array.prototype.slice.call(arguments, 1);

                if (args.length) {
                    return function () {
                        return arguments.length ? fn.apply(context, args.concat(Array.prototype.slice.call(arguments))) : fn.apply(context, args);
                    };
                }
                return function () {
                    return arguments.length ? fn.apply(context, arguments) : fn.apply(context);
                };
            };
        };

        return pipeline;
    });

    app.factory('Enum', function () {

        function Enum() {
            var states = Array.prototype.slice.apply(arguments, [0]);
            for (var i = 0, j = states.length; i < j; i++) {
                this[states[i].toUpperCase()] = i;
            }
        }

        return Enum;
    })

})(window, document, window.angular, 'RomeoApp', 'services');
