(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [ns + '.services',
         ns + '.directives',
         'LocalStorageModule'] /* module dependencies */);

    app.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$modal', 'localStorageService', function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $modal, localStorageService) {

        $scope.wonder = ng.element(d.getElementById('wonder'));
        $scope.wrapper = ng.element(d.getElementById('wrapper'));
        $scope.html = ng.element(d.querySelector('html'));
        $scope.body = ng.element(d.body);

        $rootScope.isUnique = function(arr, string) {
            if ( arr.length === 0 ) {
                return true;
            }
            for ( var i = 0; i < arr.length; i++ ) {
                if ( arr[i] === string ) return false;
            }
            return true;
        };
        
        $rootScope.closeModal = function() {
            $modal.hide();
        };

        $rootScope.logOut = function() {
            localStorageService.remove('session_url');
            $location.path('/login');
            $scope.wonder.removeClass('aside');
            $scope.wrapper.removeClass('aside');
            $scope.html.removeClass('aside');
            $scope.body.removeClass('aside');
        };

        $rootScope.toggleNav = function() {
            $scope.wonder.toggleClass('aside');
            $scope.wrapper.toggleClass('aside');
            $scope.html.toggleClass('aside');
            $scope.body.toggleClass('aside');
        };

        $scope.toggleQuickShare = function(e) {
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.showQuickShare = !$scope.showQuickShare;
                });
            });
        };

        $rootScope.$on('$locationChangeSuccess', function(event){

            $scope.wonder.removeClass('aside');
            $scope.wrapper.removeClass('aside');
            $scope.html.removeClass('aside');
            $scope.body.removeClass('aside');
        });
        // $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
        // });
    
        $rootScope.isCurrentPage = function(route){
            console.log(route, $location.path());
            return route === $location.path();
        };
    }]);

    app.controller('DashboardController', 
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', 
        function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile) {
    }]);

    app.controller('LibraryController', 
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$sanitize', '$modal', 'VideoService', 'StatsService', 'DragDropService', 'FlashService', '$filter',
        function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $sanitize, $modal, VideoService, StatsService, DragDropService, FlashService, $filter) {

        VideoService.getAll().then(function(data){
            $timeout(function(){
                $scope.$apply(function(){
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
        }, function(err){
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

        $scope.buildView = function() {
            var template = $templateCache.get(( $scope.viewType === 'list' ? 'video-list-list' : 'video-list-grid' ) + '.html' );
            var tmpl = $compile($sanitize(template))($scope);
            $scope.view.html('');
            $scope.view.append(tmpl);
        };

        $scope.changeView = function( view ) {
            $timeout( function () {
                $scope.$apply(function(){
                    $scope.selectedItems = [];
                    $scope.$broadcast('deselectAll');
                    $scope.viewType = view;
                    $scope.buildView();
                });
            });
        };

        // Listen for checkbox events ( these are coming from the checkbox directive )
        $scope.$on('checkboxChecked', function(event, checked, id) {
            $timeout(function() {
                $scope.$apply(function() {
                    if ( checked === true ) {
                        if ( $rootScope.isUnique( $scope.selectedItems, id ) ) {
                            $scope.selectedItems.push( id );
                        }
                    } else {
                        for ( var i = 0; i < $scope.selectedItems.length; i++ ) {
                            if ( id === $scope.selectedItems[i] ) {
                                $scope.selectedItems.splice(i, 1);
                            }
                        }
                    }
                    $scope.$broadcast( 'dropdown-' + ( $scope.selectedItems.length > 0 ? 'enabled' : 'disabled' ) );
                });
            });
        });

        /*  Drag n' Drop events
         /* ================================== */
        $scope.$on('dragStarted', function(e, index){
            $timeout(function(){
                $scope.$apply(function(){
                    // If the selected items list is empty
                    if ( $scope.selectedItems.length === 0 ) {
                        $scope.dragItem = index;
                        DragDropService.setTags([$scope.videos[index].title]);
                    } else {
                        // Not in the list
                        if ( $rootScope.isUnique( $scope.selectedItems, index ) ) {
                            $timeout(function(){
                                $scope.$apply(function(){
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

        $scope.$on('dragDropped', function(e, index){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.selectedAction = index;
                    $scope.addToCollection();
                });
            });
        });

        $scope.$on('dragCancelled', function(e, index){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.dragItem = undefined;
                });
            });
        });

        /*  Search text change watcher
         /* ================================== */
        $scope.$watch('filter.searchtext', function(newValue, oldValue){
            var res = $filter('videoSearchFilter')($scope.videos, $scope.filter);
            $scope.filter.results = res.results;
            $scope.filter.numresults = res.length;
        });

        /*  Selected ( checked ) item watcher
         /* ================================== */
        $scope.$watchCollection('selectedItems', function(newValue, oldValue){
            var tags = [];
            if ( $scope.dragItem !== undefined ) {
                console.log($scope.videos[$scope.dragItem]);
                tags.push($scope.videos[$scope.dragItem]);
            }
            if ( newValue.length > 0 ) {
                for ( var i = 0; i < newValue.length; i++ ) {
                    tags.push($scope.videos[newValue[i]].title);
                }
                DragDropService.setTags(tags);
            }
        });

        /*  UI Actions
         /* ================================== */

        // Apply a filter to the video list
        $scope.filterByCollection = function($event, id) {
            event.preventDefault();
            $timeout( function(){
                $scope.$apply(function() {
                    $scope.filter.collection = id;
                    var res = $filter('videoSearchFilter')($scope.videos, $scope.filter);
                    $scope.filter.results = res.results;
                    $scope.filter.numresults = res.length;
                });
            });
        };

        // Clear the video list filter
        $scope.clearFilter = function($event, txt) {
            event.preventDefault();
            var type = txt || '';

            $timeout( function(){
                $scope.$apply(function() {

                    if ( type === 'collection' ) {
                        $scope.filter.collection = null;
                    } else if ( type === 'search' ) {
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


        $scope.showAddToCollectionForm = function($event){
            var arr = [];
            ng.forEach( $scope.collections, function( value, key ) {
                arr.push({
                    key: key,
                    label: value.label
                });
            });
            $modal.load('modal-add-to-collection.html', true, $scope, { collections: arr, selectedAction: arr[0] });
        };

        $scope.submitAddToCollectionForm = function(data){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.selectedAction = data.selectedAction.key
                    $scope.addToCollection();
                    $modal.hide();
                });
            });
        };

        $scope.showRemoveFromCollectionForm = function($event){
            var arr = [];
            ng.forEach( $scope.collections, function( value, key ) {
                arr.push({
                    key: key,
                    label: value.label
                });
            });
            $modal.load('modal-remove-from-collection.html', true, $scope, { collections: arr, selectedAction: arr[0] });
        };

        $scope.submitRemoveFromCollectionForm = function(data){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.selectedAction = data.selectedAction.key
                    $scope.addToCollection();
                    $modal.hide();
                });
            });
        };

        $scope.addToCollection = function($event) {
            if ( $event ) {
                $event.preventDefault();
            }
            $timeout( function() {
                $scope.$apply(function() {

                    var cat = $scope.selectedAction;

                    console.log( 'cat', cat );

                    if ( $scope.dragItem !== undefined && $rootScope.isUnique( $scope.selectedItems, $scope.dragItem ) ) {
                        $scope.selectedItems.push( $scope.dragItem );
                    }

                    for ( var i = 0; i < $scope.selectedItems.length; i++ ) {
                        if ( $rootScope.isUnique( $scope.videos[$scope.selectedItems[i]].collections, cat ) === true  ) {
                            $scope.videos[$scope.selectedItems[i]].collections.push(cat);
                            FlashService.flash( 'Successfully added ' + $scope.videos[$scope.selectedItems[i]].title + ' to ' + $scope.collections[cat].label, 'success' );
                        } else {
                            FlashService.flash( $scope.videos[$scope.selectedItems[i]].title + ' is already in the collection ' + $scope.collections[cat].label, 'warning' );
                        }
                    }
                    $scope.selectedItems = [];
                    $scope.$broadcast( 'dropdown-disabled' );
                    $scope.$broadcast( 'deselectAll' );
                });
            });
        };

        $scope.removeFromCollection = function($event, index, collection){
            $event.preventDefault();
            ng.forEach( $scope.videos[index].collections, function( value, key ) {
                if ( value === collection ) {
                    $timeout(function(){
                        $scope.$apply(function(){
                            $scope.videos[index].collections.splice(key, 1);
                            FlashService.flash('Successfully removed video from collection', 'success');
                        });
                    });
                }
            });
        };

        $scope.selectAll = function($event){
            $event.preventDefault();

            $scope.$broadcast('selectAll');

            $timeout(function(){
                $scope.$apply(function() {
                    $scope.selectedItems = [];
                    ng.forEach( $scope.videos, function( value, key ) {
                        $scope.selectedItems.push(key);
                    });
                    console.log($scope.selectedItems);
                    $scope.$broadcast( 'dropdown-enabled' );
                });
            });
        };

        $scope.deselectAll = function($event){
            $event.preventDefault();
            $scope.$broadcast('deselectAll');
            $timeout(function(){
                $scope.$apply(function() {
                    $scope.selectedItems = [];
                    $scope.$broadcast( 'dropdown-disabled' );
                });
            });
        };

        $scope.listCollections = function(arr){
            var col = [];
            ng.forEach( arr, function( value, key ) {
                col.push($scope.collections[value].label);
            });
            return col.join(', ');
        };

        $scope.showEditCollectionForm = function($event, name, id) {
            $modal.load('modal-edit-collection.html', true, $scope, { id: id, name: name });
        };

        $scope.submitEditCollectionForm = function(data) {
            if ( data.name.length > 0 ) {
                $scope.collections[data.id].title = data.name;
                $modal.hide();
            }
        };

        $scope.deleteCollection = function($event, data) {

            $timeout(function(){
                $scope.$apply(function(){
                    delete $scope.collections[data.id];
                    $scope.filter.collection = null;
                });
            });

            ng.forEach( $scope.videos, function( value, key ) {
                ng.forEach( value.collections, function(value2, key2 ) {
                    if ( parseInt(value2) === parseInt(data.id) ) {
                        $timeout(function(){
                            $scope.$apply(function(){
                                $scope.videos[key].collections.splice(key2, 1);
                            });
                        });
                    }
                });
            });
            $modal.hide();
        };

        $scope.showNewCollectionForm = function($event) {
            $modal.load('modal-new-collection.html', true, $scope, {});
        };

        $scope.submitNewCollectionForm = function(data) {
            $scope.collections[Math.floor(Math.random() * 10) + parseInt(new Date().getTime()).toString(36)] = {
                label: data.name
            }
            $modal.hide();
        };

        $scope.showAllCollections = function($event, key) {
            $event.preventDefault();
            $modal.load('modal-show-all-collections.html', true, $scope, { id: key, video: $scope.videos[key] });
        };

        $scope.closeModal = function($event) {
            $modal.hide();
        };

    }]);

    app.controller('AccountController', ['$scope', '$rootScope', 'AuthService', 'DataService', function ($scope, $rootScope, AuthService, DataService) {

        // Are we logged in?
        $scope.isLoggedIn = AuthService.getSession();
        $scope.isEditable = false;

        $scope.avatarFile = null;
        $scope.profileFile = null;

        $scope.formData = new FormData();

        $scope.accountForm = angular.copy($rootScope.account);

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
        };

        $scope.updateUser = function () {
            var fd = $scope.formData;
            //Take the first selected file

            $scope.avatarFile && fd.append('avatar', $scope.avatarFile);
            $scope.profileFile && fd.append('profile_cover', $scope.profileFile);

            DataService.request('/api/account/75435685', true, fd, {
                method: 'PATCH',
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity,
                data: fd
            });

        };

        $scope.changed = function (name, value) {
            $scope.formData.append(name, value);
        }

    }]);

    app.controller('UploadController', 
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', 'VideoService', '$modal', 'animLoop', 'prettydate', '$interval', '$upload', 
        function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, VideoService, $modal, animLoop, prettydate, $interval, $upload) {

        //$loginCheck();
        
        $scope.state = "start";

        /*
        * State objects showing which thumbnail has been selected out of the available video thumbnails
        */        
        $scope.thumbIndex = 0;
        $scope.thumbnails = ['/static/assets/img/placeholder-photo-large.jpg','/static/assets/img/placeholder-photo-large.jpg','/static/assets/img/placeholder-photo-large.jpg','/static/assets/img/placeholder-photo-large.jpg','/static/assets/img/placeholder-photo-large.jpg'];

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
                name: "",
                confirmed: false,
                upload: {
                    progress: 2.5
                },
                process: {
                    progress: 0
                },
                state: "empty",
                thumbnail: null
            };

        $scope.files = null;

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
            },  1000)
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
        $scope.$on('fileSelected', function(e, eventData){

            var name = eventData.target.value.split('\\');
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.file.state = "chosen";                    
                    $scope.file.name = name[name.length-1];
                });
            });
        });

        /*
        * Listen for autosave broadcasts from our auto-save-field directives
        */
        $scope.$on('autosave', function(e, elem, date){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.status.saved = prettydate(date);
                    $scope.status.date = date;
                });
            });
        });

        /*
        * Strips out any HTML tags and pasts in plain text
        */
        $scope.cleanPaste = function(e){
            e.preventDefault();
            var text = e.clipboardData.getData("text/plain");
            document.execCommand("insertHTML", false, text);
        };        

        /*
        * Used as a callback to update the size of the upload progress bar
        */
        $scope.incrementProgress = function(){
            if ( $scope.file.upload.progress < 100 ) {
                $timeout(function(){
                    $scope.$apply(function(){
                        $scope.file.upload.progress += 8;
                    });
                });
            } else {
                $timeout(function(){
                    $scope.$apply(function(){
                        $scope.file.upload.progress = 100;
                        animLoop.remove('incrementProgress');
                        $scope.file.state = 'complete';
                    });
                });
            }
        };

        /*
        * Check the progress of the file upload adn update the UI
        */
        $scope.getUploadProgress = function(){
        };


        $scope.onFileSelect = function($files) {
            $scope.file.state = "chosen";
            $scope.files = $files;
        };

        /*
        * The user has confirmed that they have chosen the correct file to upload
        */
        $scope.startUpload = function() {

            VideoService.getUploadArgs().then(function(uploadArgs){
                var formData = new FormData(),
                    uploadPath;

                ng.forEach(uploadArgs.fields, function ( val ) {
                    formData.append(val.name, val.value);
                    if (val.name == 'key') {
                        uploadPath = val.value;
                    }
                });

                for (var i = 0; i < $scope.files.length; i++) {
                  var file = $scope.files[i];
                  $scope.upload = $upload.upload({
                    url: uploadArgs.actino, //upload.php script, node.js route, or servlet url
                    method: 'PUT',
                    // method: POST or PUT,
                    // headers: {'header-key': 'header-value'},
                    // withCredentials: true,
                    // data: {myObj: $scope.myModelObj},
                    data: formData,
                    file: file, // or list of files: $files for html5 only
                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                    //formDataAppender: function(formData, key, val){}
                  }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                  }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                  });
                  //.error(...)
                  //.then(success, error, progress); 
                  //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
                }




                // $http({
                //     url: uploadArgs.action,
                //     type: 'post',
                //     data: formData,
                //     processData: false,
                //     mimeType: 'multipart/form-data',
                //     contentType: false,
                //     xhr: function () {
                //         var xhr = $.ajaxSettings.xhr();
                //         xhr.upload.onprogress = function (e) {
                //             var p = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
                //             status.html(p ? p.toString() + '%' : '');
                //         };
                //         return xhr;
                //     }
                // }).done(function () {
                //     // Set metadata form filename field to mark that upload is complete
                //     filename.val(uploadPath).trigger('change');
                //     status.hide();
                // }).fail(function () {
                //     console.log(arguments);
                //     status.html('Failed');
                // });

                $timeout(function(){
                    $scope.$apply(function(){
                        $scope.file.state = "uploading";
                    });
                });
                // animLoop.add('getUploadProgress', $scope.getUploadProgress);
                animLoop.add('incrementProgress', $scope.incrementProgress);
                animLoop.start();
            });

        };

        /*
        * Save the current state of the vide meta data
        */
        $scope.save = function(e) {

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

            $scope.chosenCategory.id = $el.data('id');
            $scope.chosenCategory.label = 'Category: ' + $el.text();
            $modal.hide();
        };

        /*
        * The progress of the upload has reached a point where we can let the user choose a thumbnail
        */
        $scope.showThumbnailChooser = function(e) {

            $modal.load('modal-thumbnail-picker.html', true, $scope, { thumbnails: $scope.thumbnails }, { width: 910 });

            // $timeout(function(){
            //     $scope.$apply(function(){
            //         $scope.file.thumbnail = '/static/assets/img/placeholder-photo-large.jpg';
            //     });
            // });
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
        var Sections = analytics.Sections= new Enum('OVERVIEW', 'PERFORMANCE', 'GEOGRAPHIC', 'ENGAGEMENT');

        // Scope Functions

        $scope.getFields = function (filterObj) {
            return _.where(analytics.fields, filterObj);
        };

        $scope.isSection = function(section) {
            return analytics.section === section;
        };

        // TODO Change flip function to be semantic and use a better selector
        $scope.flip = function () {
            angular.element($element[0].querySelectorAll('#analytics-bottom-panel')).toggleClass('flip');
        };

        $scope.notifyChange = function() {
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
                        $location.url('/library');
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
