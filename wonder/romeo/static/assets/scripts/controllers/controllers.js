(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [ns + '.services',
                ns + '.directives',
            'LocalStorageModule'] /* module dependencies */);

    app.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$modal', '$element', 'localStorageService', 'AuthService', function ($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $modal, $element, localStorageService, AuthService) {

        $scope.wonder = ng.element(d.getElementById('wonder'));
        $scope.wrapper = ng.element(d.getElementById('wrapper'));
        $scope.html = ng.element(d.querySelector('html'));
        $scope.body = ng.element(d.body);

        $scope.isLoggedIn = AuthService.isLoggedIn();

        if ($scope.isLoggedIn) {
            if (!($scope.account = AuthService.getUser())) {
                AuthService.retrieveSession(AuthService.getSession()).then(function (sessionData) {
                    $scope.account = sessionData;
                    AuthService.setSession(sessionData);
                });
            }
        }

        $rootScope.isUnique = function (arr, string) {
            if (arr.length === 0) {
                return true;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === string) return false;
            }
            return true;
        };

        $rootScope.closeModal = function () {
            $modal.hide();
        };

        $rootScope.logOut = function () {
            localStorageService.remove('session_url');
            $location.path('/login');
            $scope.wonder.removeClass('aside');
            $scope.wrapper.removeClass('aside');
            $scope.html.removeClass('aside');
            $scope.body.removeClass('aside');
        };

        $rootScope.toggleNav = function () {
            $scope.wonder.toggleClass('aside');
            $scope.wrapper.toggleClass('aside');
            $scope.html.toggleClass('aside');
            $scope.body.toggleClass('aside');
        };

        $scope.toggleQuickShare = function (e) {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.showQuickShare = !$scope.showQuickShare;
                });
            });
        };

        $rootScope.$on('$locationChangeSuccess', function (event, newRoute, oldRoute) {

            var newRoutePart = newRoute.replace(/http:\/\/localhost:5000\/#\/(\w*)\/.+/, '$1');
            var oldRoutePart = oldRoute.replace(/http:\/\/localhost:5000\/#\/(\w*)\/.+/, '$1');

            $element.removeClass('route-' + oldRoutePart);
            $element.addClass('route-' + newRoutePart);

            $scope.wonder.removeClass('aside');
            $scope.wrapper.removeClass('aside');
            $scope.html.removeClass('aside');
            $scope.body.removeClass('aside');
        });
        // $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
        // });

        $rootScope.isCurrentPage = function (route) {
            console.log(route, $location.path());
            return route === $location.path();
        };
    }]);

    app.controller('DashboardController',
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile',
            function ($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile) {
            }]);

    app.controller('LibraryController',
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$sanitize', '$modal', 'VideoService', 'StatsService', 'DragDropService', 'FlashService', '$filter',
            function ($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $sanitize, $modal, VideoService, StatsService, DragDropService, FlashService, $filter) {

                VideoService.getAll().then(function (data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.videos = data.videos;
                            $scope.collections = data.collections;

                            var res = $filter('videoSearchFilter')($scope.videos, $scope.filter);
                            $scope.filter.results = res.results;
                            $scope.filter.numresults = res.length;

                            $scope.loading = false;
                            $scope.selectedAction = $scope.collections[0];

                            $scope.buildView();
                        });
                    }, 500);
                }, function (err) {
                    console.log(err);
                    // console.log('ERROR');
                });

                // $scope.selectedAction = undefined;
                $scope.modalShowing = false;
                $scope.dragItem = undefined;
                $scope.loading = true;
                $scope.numResults = 0;
                $scope.viewType = "grid";

                $scope.selectedItems = [];
                $scope.searchResults = {};
                $scope.filterText = '';

                $scope.view = ng.element(d.getElementById('video-view'));

                $scope.filter = {
                    collection: null,
                    searchtext: "",
                    results: {},
                    numresults: 0
                };

                $scope.buildView = function () {
                    var template = $templateCache.get(( $scope.viewType === 'list' ? 'video-list-list' : 'video-list-grid' ) + '.html');
                    var tmpl = $compile($sanitize(template))($scope);
                    $scope.view.html('');
                    $scope.view.append(tmpl);
                };

                $scope.changeView = function (view) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.selectedItems = [];
                            $scope.$broadcast('deselectAll');
                            $scope.viewType = view;
                            $scope.buildView();
                        });
                    });
                };

                // Listen for checkbox events ( these are coming from the checkbox directive )
                $scope.$on('checkboxChecked', function (event, checked, id) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            if (checked === true) {
                                if ($rootScope.isUnique($scope.selectedItems, id)) {
                                    $scope.selectedItems.push(id);
                                }
                            } else {
                                for (var i = 0; i < $scope.selectedItems.length; i++) {
                                    if (id === $scope.selectedItems[i]) {
                                        $scope.selectedItems.splice(i, 1);
                                    }
                                }
                            }
                            $scope.$broadcast('dropdown-' + ( $scope.selectedItems.length > 0 ? 'enabled' : 'disabled' ));
                        });
                    });
                });

                /*  Drag n' Drop events
                 /* ================================== */
                $scope.$on('dragStarted', function (e, index) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            // If the selected items list is empty
                            if ($scope.selectedItems.length === 0) {
                                $scope.dragItem = index;
                                DragDropService.setTags([$scope.videos[index].title]);
                            } else {
                                // Not in the list
                                if ($rootScope.isUnique($scope.selectedItems, index)) {
                                    $timeout(function () {
                                        $scope.$apply(function () {
                                            $scope.selectedItems = [];
                                            $scope.dragItem = index;
                                            DragDropService.setTags([$scope.videos[index].title]);
                                            $scope.$broadcast('deselectAll');
                                        });
                                    });
                                    // In the list
                                } else {
                                    $scope.dragItem = undefined;
                                }
                            }
                        });
                    });
                });

                $scope.$on('dragDropped', function (e, index) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.selectedAction = index;
                            $scope.addToCollection();
                        });
                    });
                });

                $scope.$on('dragCancelled', function (e, index) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.dragItem = undefined;
                        });
                    });
                });

                /*  Search text change watcher
                 /* ================================== */
                $scope.$watch('filter.searchtext', function (newValue, oldValue) {
                    var res = $filter('videoSearchFilter')($scope.videos, $scope.filter);
                    $scope.filter.results = res.results;
                    $scope.filter.numresults = res.length;
                });

                /*  Selected ( checked ) item watcher
                 /* ================================== */
                $scope.$watchCollection('selectedItems', function (newValue, oldValue) {
                    var tags = [];
                    if ($scope.dragItem !== undefined) {
                        console.log($scope.videos[$scope.dragItem]);
                        tags.push($scope.videos[$scope.dragItem]);
                    }
                    if (newValue.length > 0) {
                        for (var i = 0; i < newValue.length; i++) {
                            tags.push($scope.videos[newValue[i]].title);
                        }
                        DragDropService.setTags(tags);
                    }
                });

                /*  UI Actions
                 /* ================================== */

                // Apply a filter to the video list
                $scope.filterByCollection = function ($event, id) {
                    event.preventDefault();
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.filter.collection = id;
                            var res = $filter('videoSearchFilter')($scope.videos, $scope.filter);
                            $scope.filter.results = res.results;
                            $scope.filter.numresults = res.length;
                        });
                    });
                };

                // Clear the video list filter
                $scope.clearFilter = function ($event, txt) {
                    event.preventDefault();
                    var type = txt || '';

                    $timeout(function () {
                        $scope.$apply(function () {

                            if (type === 'collection') {
                                $scope.filter.collection = null;
                            } else if (type === 'search') {
                                $scope.filter.searchtext = '';
                            } else {
                                $scope.filter.collection = null;
                                $scope.filter.searchtext = '';
                            }

                            var res = $filter('videoSearchFilter')($scope.videos, $scope.filter);
                            $scope.filter.results = res.results;
                            $scope.filter.numresults = res.length;
                        });
                    });
                };

                // $scope.noResults = function(){
                // console.log( $filter('videoSearchFilter')($scope.videos, $scope.filterText) );
                // if ( $filter('videoSearchFilter')($scope.videos).length ) {
                // }
                // };

                $scope.showAddToCollectionForm = function ($event) {
                    var arr = [];
                    ng.forEach($scope.collections, function (value, key) {
                        arr.push({
                            key: key,
                            label: value.label
                        });
                    });
                    $modal.load('modal-add-to-collection.html', true, $scope, { collections: arr, selectedAction: arr[0] });
                };

                $scope.submitAddToCollectionForm = function (data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.selectedAction = data.selectedAction.key
                            $scope.addToCollection();
                            $modal.hide();
                        });
                    });
                };

                $scope.showRemoveFromCollectionForm = function ($event) {
                    var arr = [];
                    ng.forEach($scope.collections, function (value, key) {
                        arr.push({
                            key: key,
                            label: value.label
                        });
                    });
                    $modal.load('modal-remove-from-collection.html', true, $scope, { collections: arr, selectedAction: arr[0] });
                };

                $scope.submitRemoveFromCollectionForm = function (data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.selectedAction = data.selectedAction.key
                            $scope.addToCollection();
                            $modal.hide();
                        });
                    });
                };

                $scope.addToCollection = function ($event) {
                    if ($event) {
                        $event.preventDefault();
                    }
                    $timeout(function () {
                        $scope.$apply(function () {

                            var cat = $scope.selectedAction;

                            console.log('cat', cat);

                            if ($scope.dragItem !== undefined && $rootScope.isUnique($scope.selectedItems, $scope.dragItem)) {
                                $scope.selectedItems.push($scope.dragItem);
                            }

                            for (var i = 0; i < $scope.selectedItems.length; i++) {
                                if ($rootScope.isUnique($scope.videos[$scope.selectedItems[i]].collections, cat) === true) {
                                    $scope.videos[$scope.selectedItems[i]].collections.push(cat);
                                    FlashService.flash('Successfully added ' + $scope.videos[$scope.selectedItems[i]].title + ' to ' + $scope.collections[cat].label, 'success');
                                } else {
                                    FlashService.flash($scope.videos[$scope.selectedItems[i]].title + ' is already in the collection ' + $scope.collections[cat].label, 'warning');
                                }
                            }
                            $scope.selectedItems = [];
                            $scope.$broadcast('dropdown-disabled');
                            $scope.$broadcast('deselectAll');
                        });
                    });
                };

                $scope.removeFromCollection = function ($event, index, collection) {
                    $event.preventDefault();
                    ng.forEach($scope.videos[index].collections, function (value, key) {
                        if (value === collection) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.videos[index].collections.splice(key, 1);
                                    FlashService.flash('Successfully removed video from collection', 'success');
                                });
                            });
                        }
                    });
                };

                $scope.selectAll = function ($event) {
                    $event.preventDefault();

                    $scope.$broadcast('selectAll');

                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.selectedItems = [];
                            ng.forEach($scope.videos, function (value, key) {
                                $scope.selectedItems.push(key);
                            });
                            console.log($scope.selectedItems);
                            $scope.$broadcast('dropdown-enabled');
                        });
                    });
                };

                $scope.deselectAll = function ($event) {
                    $event.preventDefault();
                    $scope.$broadcast('deselectAll');
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.selectedItems = [];
                            $scope.$broadcast('dropdown-disabled');
                        });
                    });
                };

                $scope.listCollections = function (arr) {
                    var col = [];
                    ng.forEach(arr, function (value, key) {
                        col.push($scope.collections[value].label);
                    });
                    return col.join(', ');
                };

                $scope.showEditCollectionForm = function ($event, name, id) {
                    $modal.load('modal-edit-collection.html', true, $scope, { id: id, name: name });
                };

                $scope.submitEditCollectionForm = function (data) {
                    if (data.name.length > 0) {
                        $scope.collections[data.id].title = data.name;
                        $modal.hide();
                    }
                };

                $scope.deleteCollection = function ($event, data) {

                    $timeout(function () {
                        $scope.$apply(function () {
                            delete $scope.collections[data.id];
                            $scope.filter.collection = null;
                        });
                    });

                    ng.forEach($scope.videos, function (value, key) {
                        ng.forEach(value.collections, function (value2, key2) {
                            if (parseInt(value2) === parseInt(data.id)) {
                                $timeout(function () {
                                    $scope.$apply(function () {
                                        $scope.videos[key].collections.splice(key2, 1);
                                    });
                                });
                            }
                        });
                    });
                    $modal.hide();
                };

                $scope.showNewCollectionForm = function ($event) {
                    $modal.load('modal-new-collection.html', true, $scope, {});
                };

                $scope.submitNewCollectionForm = function (data) {
                    $scope.collections[Math.floor(Math.random() * 10) + parseInt(new Date().getTime()).toString(36)] = {
                        label: data.name
                    }
                    $modal.hide();
                };

                $scope.showAllCollections = function ($event, key) {
                    $event.preventDefault();
                    $modal.load('modal-show-all-collections.html', true, $scope, { id: key, video: $scope.videos[key] });
                };

                $scope.closeModal = function ($event) {
                    $modal.hide();
                };

            }]);

    app.controller('AccountController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthService', 'DataService', '$q', function ($scope, $rootScope, $location, $routeParams, AuthService, DataService, $q) {

        var sessionUrl;
        var accountID;

        // Are we logged in?
        $scope.State = 'INIT';
        $scope.isEditable = false;

        $scope.avatarFile = null;
        $scope.profileFile = null;

        $scope.formData = new FormData();

        $scope.account = angular.copy(AuthService.getUser());

        $scope.isLoggedIn = AuthService.isLoggedIn();

        $scope.profileData = {
            accountID: null,
            name: null,
            username: null,
            description: null,
            avatarURL: null,
            profileURL: null
        };

        $scope.getAccountData = function(accountID) {

            var deferred = $q.defer();

            if (accountID) {
                DataService.request({
                    url: 'api/account/' + accountID
                }).then(function(data) {
                    deferred.resolve(data);
                }, deferred.reject);
            } else if (sessionUrl = AuthService.getSession()) {
                AuthService.retrieveSession(sessionUrl).then(deferred.resolve, deferred.reject);
            }

            return deferred.promise;
        };


        $scope.getChangedProperties = function () {
            return _.reject($scope.accountForm, function (value, key) {
                return value === $rootScope.user[key];
            });
        };

        $scope.toggleEditable = function () {
            $scope.isEditable = !$scope.isEditable;
        };

        $scope.changeAvatar = function (newFile) {
            $scope.avatarFile = newFile;
            $scope.updateUser();
            $scope.avatarFile = null;
        };

        $scope.changeProfileBackground = function (newFile) {
            $scope.profileFile = newFile;
            $scope.updateUser();
            $scope.profileFile = null;
        };

        $scope.changeField = function (name, value) {
            $scope.updateUser(name, value);
        };

        $scope.updateUser = function (name, value) {
            var fd = new FormData();
            //Take the first selected file

            fd.append(name, value);

            DataService.request({
                url: '/api/account/75435685',
                method: 'PATCH',
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity,
                data: fd
            }).then(function (accountData) {
                $scope.profileData = {
                    name: accountData.name,
                    username: accountData.display_name,
                    description: null,
                    avatarURL: accountData.avatar,
                    profileURL: accountData.profile_cover.replace(/thumbnail_medium/, 'ipad')
                };
            })

        };

        $scope.changed = function (name, value) {
            $scope.formData.append(name, value);
        };

        $scope.disallowNewlines = function ($event) {
            if ($event.keyCode === 13) {
                $event.preventDefault();
            }
        };

        /* ----- Logic Here ---- */

        $scope.getAccountData($routeParams.accountID).then(function (accountData) {
            $scope.profileData = {
                name: accountData.name,
                username: accountData.display_name,
                description: null,
                avatarURL: accountData.avatar,
                profileURL: accountData.profile_cover.replace(/thumbnail_medium/, 'ipad')
            };
            $scope.State = 'SUCCESS';
        }, function () {
//            debugger;
            $scope.State = 'ERROR';
        });

        /*        avatar: "http://media.dev.wonderpl.com/images/avatar/thumbnail_medium/_SXWl-cdXyMlP5z_FSgqLg.jpg"
         display_name: "test"
         href: "/api/account/75435685"
         name: "test"
         player_logo: null
         profile_cover: "http://media.dev.wonderpl.com/images/profile/thumbnail_medium/2sInhh8sbbAsRK-C_Yf4bQ.jpg"*/

        $scope.$watch('isEditable', function (newValue) {
            if (newValue) {
                $timeout(function () {
                    $element.find('h2:first').focus();
                });
            }
        });

    }]);

    app.controller('UploadController', 
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', 'VideoService', '$modal', 'animLoop', 'prettydate', '$interval', '$upload', 
        function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, VideoService, $modal, animLoop, prettydate, $interval, $upload) {

        /*
        * The state object for the chosen category for the video
        */
        $scope.chosenCategory = {
            id: undefined,
            label: undefined
        };

        /*
        * The state object used by the quick share modal - stores the addresses
        */
        $scope.shareAddresses = [];

        /*
        * The state object for showing file upload progress
        */
        $scope.file = {
            upload: {
                progress: 0
            },
            data: null,
            state: "empty"
        };

        /*
        * State object for remembering changes to the video record, before the title is added
        */
        $scope.deferredData = {};

        /*
        * State object for the actual Video record
        */                
        $scope.video = {
            id: null,
            href: null,
            status: null,
            title: "",
            description: "", 
            category: null
        };

        /*
        * State objects showing which thumbnail has been selected out of the available video thumbnails
        */        
        $scope.previewIndex = 0;
        $scope.chosenPreviewImage = null;
        $scope.previewImages = ['/static/assets/img/test-image-1.jpg','/static/assets/img/test-image-2.jpg','/static/assets/img/test-image-3.jpg','/static/assets/img/test-image-1.jpg','/static/assets/img/test-image-2.jpg','/static/assets/img/test-image-3.jpg'];

        /*
        * The state object for autosaving the video
        */
        $scope.status = {
            saved: null,
            date: null,
            updateInterval: $interval(function(){
                $timeout(function(){
                    $scope.$apply(function(){
                        $scope.status.saved = $scope.status.saved !== null ? prettydate($scope.status.date) : null;
                    });
                });
            },  30000)
        };

        /*
        * Get the list of categories from the web service
        */
        VideoService.getCategories().then(function(data){
            $scope.categories = data.category.items;
        }, function(err){
            console.log(err);
        });      

        /*
        * The user has chosen a new file, respond accordingly.
        */
        $scope.fileSelected = function($files){
            var name = $files[0].name.split('\\');
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.file.state = "chosen";                    
                    $scope.file.data = $files[0];
                    $scope.file.name = name[name.length-1];
                });
            });
        };

        /*
        * Strips out any HTML tags and pasts in plain text
        */
        $scope.cleanPaste = function(e){
            e.preventDefault();
            var text = e.clipboardData.getData("text/plain");
            document.execCommand("insertHTML", false, text);
        };        

        /*
        * Check the progress of the file upload adn update the UI
        */
        $scope.getUploadProgress = function(){
        };

        /*
        * The user has selected a file via the file input
        */
        // $scope.onFileSelect = function($files) {
        //     $scope.file.state = "chosen";
        //     $scope.file.data = $files;
        // };

        /*
        * The user has confirmed that they have chosen the correct file to upload
        */
        $scope.startUpload = function() {

            VideoService.getUploadArgs().then(function(uploadArgs){

                var formData = new FormData(),
                    uploadPath;

                $.each(uploadArgs.fields, function () {
                    formData.append(this.name, this.value);
                    if (this.name == 'key') {
                        uploadPath = this.value;
                    }
                });

                formData.append('file', $scope.file.data);

                $.ajax({
                    url: uploadArgs.action,
                    type: 'post',
                    data: formData,
                    processData: false,
                    mimeType: 'multipart/form-data',
                    contentType: false,
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        xhr.upload.onprogress = function (e) {
                            $timeout( function() {
                                $scope.$apply(function() {
                                    var p = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
                                    $scope.file.upload.progress = p;
                                });
                            });
                        };
                        return xhr;
                    }
                }).done(function (response) {
                    $timeout(function() {
                        $scope.$apply(function(){
                            var data = { filename: uploadPath };
                            $scope.video.filename = uploadPath;
                            $scope.file.state = 'processing';
                            $scope.updateVideo(data);

                            // POLLING
                            $scope.processingInterval = $interval(function(){

                                // Check for thumbnails
                                VideoService.getPreviewImages($scope.video.id).then(function(response){
                                    console.log('checking for preview images', response);
                                    $scope.thumbnails = response.images.items;
                                });

                                // Check for state change in the video record
                                VideoService.get($scope.video.id).then(function(response){
                                    console.log( 'checking for state change', response );
                                    if ( response.status === 'ready' ) {
                                        $interval.cancel($scope.processingInterval);
                                        $timeout(function() {
                                            $scope.$apply(function() {
                                                $scope.file.state = 'complete';
                                            });
                                        });
                                    } else {    
                                        console.log(' video still processing' );
                                    }
                                });
                            }, 10000);

                        });
                    });
                }).fail(function (response) {
                    console.log(' UPLOAD FAILED ', arguments);
                });

                $timeout(function(){
                    $scope.$apply(function(){
                        $scope.file.state = "uploading";
                    });
                });

                animLoop.start();
            });

        };

        /*
        * Listen for autosave broadcasts from our auto-save-field directives
        */
        $scope.$on('autosave', function(e, attr, val, date){

            $timeout(function(){
                $scope.$apply(function(){
                    $scope.status.saved = prettydate(date);
                    $scope.status.date = date;
                    $scope.video[attr] = val;

                    if ( $scope.video.id === null ) {
                        if ( $scope.video.title.length > 0 ) {
                            console.log('GONNA CREATE THE VIDEO');
                            $scope.createVideo();
                        }
                    } else {
                        var data = {};
                        data[attr] = val;
                        $scope.updateVideo(data);
                    }
                });
            });
            
        });

        /*
        * Create a video record ( if there is no valid video id present )
        */
        $scope.createVideo = function(e) {

            // Bundle in any deferred data
            var data = { title: $scope.video.title};
            ng.extend(data, $scope.deferredData);

            VideoService.create(data).then(function(response){
                $timeout( function() {
                    $scope.$apply(function() {
                        console.log('record created successfully', arguments);
                        ng.extend($scope.video, response);
                        $scope.deferredData = {};
                        console.log( $scope.video );
                    });
                });
            });
        };

        /*
        * Update the video record
        */
        $scope.updateVideo = function(data) {

            if ( $scope.video.id !== null ) {
                VideoService.update($scope.video.id, data).then(function(response){
                    $timeout( function() {
                        $scope.$apply(function() {
                            console.log('record updated successfully', arguments);
                            ng.extend($scope.video, response);
                            console.log( $scope.video );
                        });
                    });
                });
            } else {
                ng.extend($scope.deferredData, data);
            }
        
        };

        /*
        * Show the categories modal
        */
        $scope.showCategories = function(e) {
            $modal.load('modal-show-categories.html', true, $scope, { categories: $scope.categories });
        };

        /*
        * The user has clicked on a category in the categories modal
        */
        $scope.chooseCategory = function(e) {

            var el = e.target || e.srcElement,
                $el = ng.element(el);

            $timeout(function(){
                $scope.$apply(function(){
                    $scope.video.category = $el.data('id');
                    $scope.updateVideo({
                        category: $el.data('id')
                    });
                });
            });
            $scope.chosenCategory.id = $el.data('id');
            $scope.chosenCategory.label = 'Category: ' + $el.text();
            $modal.hide();
        };

        /*
        * Show the thumbnail chooser
        */
        $scope.showPreviewImageChooser = function(e) {
            $modal.load('modal-preview-image-picker.html', true, $scope, undefined, { width: 910 });
        };

        /*
        * Move the previewIndex for the preview image choose
        */
        $scope.previewImageChosen = function(dir) {
            VideoService.setPreviewImage().then(function(response){
                console.log( response );
                $timeout(function() {
                    $scope.$apply(function(){
                        $scope.chosenPreviewImage = $scope.previewImages[$scope.previewIndex].url;        
                    });
                });
            });
        };

        /*
        * Increment the previewIndex
        */
        $scope.previewImageNav = function(dir) {
            if ( dir === 'left' ) {
                if ( $scope.previewIndex === 0 ) {
                    $scope.previewIndex = ($scope.previewImages.length-1);
                } else {
                    $scope.previewIndex--;
                }
            } else {
                if ( $scope.previewIndex === ($scope.previewImages.length-1)) {
                    $scope.previewIndex = 0;
                } else {
                    $scope.previewIndex++;
                }
            }
        };
  
    }]);

    app.controller('AnalyticsController', ['$scope', '$rootScope', '$routeParams', '$element', 'Enum', 'AnalyticsFields', 'VideoService', function ($scope, $rootScope, $routeParams, $element, Enum, AnalyticsFields, VideoService) {

        // ---- Functions ----

        function getVideoData(videoID) {
            analytics.state = States.LOADING;
            return VideoService.getOne(videoID).then(function (videoData) {
                analytics.state = States.COMPLETE;
                //TODO This needs correcting...
                return videoData.videos[videoID];
            }, function () {
                analytics.state = States.ERROR;
            });
        }

        // ---- Variables ----

        var analytics = $scope.analytics = {
            maxFields: 5,
            dateFrom: moment(new Date()).subtract('days', 14).toDate(),
            dateTo: new Date(),
            results: {
                key: null,
                keyDisplayName: null,
                results: []
            },
            fields: AnalyticsFields,
            video: {
                videoID: null
            }
        };

        var States = analytics.States = new Enum('INITIAL', 'LOADING', 'COMPLETE', 'ERROR');
        var Sections = analytics.Sections = new Enum('OVERVIEW', 'PERFORMANCE', 'GEOGRAPHIC', 'ENGAGEMENT');

        // Scope Functions

        $scope.getFields = function (filterObj) {
            return _.where(analytics.fields, filterObj);
        };

        $scope.isSection = function (section) {
            return analytics.section === section;
        };

        // TODO Change flip function to be semantic and use a better selector
        $scope.flip = function () {
            angular.element($element[0].querySelectorAll('#analytics-bottom-panel')).toggleClass('flip');
        };

        $scope.notifyChange = function () {
            $scope.$broadcast('fields/change');
        };

        // ---- Controller Code ----

        analytics.state = States.INITIAL;

        // Load our video data FIRST
        getVideoData($routeParams.videoID).then(function (videoData) {
            analytics.video = videoData;
            analytics.video.videoID = analytics.video.videoID || $routeParams.videoID;
            analytics.section = Sections[$routeParams.type.toUpperCase()];
            console.log($scope.isSection(analytics.Sections.OVERVIEW));
        });
    }]);

    app.controller('VideoController', 
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$routeParams', '$q', 
        function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $routeParams, $q) {

        $scope.video = {};

        // VideoService.getAll().then(function(data){
        //     $timeout(function(){
        //         $scope.$apply(function(){
        //             $scope.videos = data.videos;
        //             var res = $filter('videoSearchFilter')($scope.videos, $scope.filterText);
        //             $scope.searchResults = res.results;
        //             $scope.numResults = res.length;
        //             $scope.collections = data.collections;
        //             $scope.loading = false;
        //             $scope.selectedAction = $scope.collections[0];
        //         });
        //     }, 500);
        // });


        // $timeout(function(){
        //     $scope.$apply(function(){
        //         $rootScope.pagetitle = $rootScope.data.videos[$routeParams.videoID].title;
        //         $scope.video = $rootScope.data.videos[$routeParams.videoID];
        //     });
        // });

        var template, tmpl;

        // $scope.$watch( 'metrics', function(newValue){

        // for ( var i = 0; i < $scope.metrics.length; i++ ) {
        //     $scope.chartConfig.xAxis.categories.push( moment( new Date($scope.metrics[i].date) ).format("MMM Do YY") );
        //     $scope.chartConfig.series[0].data.push($scope.metrics[i].plays);
        //     $scope.chartConfig.series[1].data.push($scope.metrics[i].daily_uniq_plays);
        //     console.log('DATA');
        // }

        // });
    }]);

    app.controller('LoginController',
        ['$scope', '$location', 'AuthService',
            function ($scope, $location, AuthService) {

                $scope.username = $scope.username || '';
                $scope.password = $scope.username || '';
                $scope.href = '';

                $scope.handleRedirect = function () {
                    var params = $location.search();
                    if (params.redirect) {
                        console.log('redirect to ->' + params.redirect);
                    } else {
                        $location.url('/upload');
                    }
                };

                $scope.login = function () {
                    return AuthService.login($scope.username, $scope.password).then($scope.handleRedirect, function () {
                        // Error Logging in
                    });
                };

            }
        ]
    );

    app.controller('LoadingController', 
        [ '$location', 'localStorageService', '$http', '$rootScope', 'FlashService', '$timeout', 
        function( $location, localStorageService, $http, $rootScope, FlashService, $timeout){

        // $timeout( function() {
        //     $rootScope.$apply(function() {
        //         $rootScope.redirectUrl = undefined;
        //     });
        //     });
        // });

        // if ( $rootScope.account === undefined ) {

        //     $http({ 
        //         method: 'get',
        //         url: localStorageService.get('session_url'), 
        //     }).success(function(data,status,headers,config){

        //         if ( status === 200 ) {
        //             $timeout(function() {
        //                 $rootScope.$apply(function(){
        //                     $rootScope.account = data.account;
        //                     $rootScope.user = data.user;
        //                     $rootScope.userID = data.href.split('/');
        //                     $rootScope.userID = $rootScope.userID[$rootScope.userID.length-1];
        //                     $location.path(url || '/library');
        //                 });
        //             });
        //         }

        //     }).error(function(data, status, headers, config){
        //         FlashService.flash( 'There was an error loading your account details, please refresh this page to try again.', 'error' );
        //     });

        // } else {
        //     $location.path(url || '/library');
        // }
    }]);

})(window,document,window.angular,'RomeoApp','controllers');
