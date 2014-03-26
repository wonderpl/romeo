(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [ns + '.services',
            ns + '.directives'] /* module dependencies */);

    app.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$modal', function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $modal) {

        $rootScope.isUnique = function(arr, string) {
            if ( arr.length === 0 ) {
                return true;
            }
            for ( var i = 0; i < arr.length; i++ ) {
                if ( arr[i] === string ) return false;
            }
            return true;
        }

        $rootScope.closeModal = function() {
            $modal.hide();
        };

        // $rootScope.$on('$locationChangeSuccess', function(event){
        // });
        // $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
        // });

    }]);

    app.controller('DashboardController', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile) {

    }]);

    app.controller('LibraryController', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$sanitize', '$modal', 'VideoService', 'StatsService', 'DragDropService', 'FlashService', '$filter', function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $sanitize, $modal, VideoService, StatsService, DragDropService, FlashService, $filter) {

        // $scope.selectedAction = undefined;
        $scope.modalShowing = false;
        $scope.dragItem = undefined;
        $scope.loading = true;
        $scope.numResults = 0;

        $scope.selectedItems = [];
        $scope.searchResults = {};
        $scope.filterText = '';

        $scope.filter = {
            collection: null,
            searchtext: "",
            results: {},
            numresults: 0
        };

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
                });
            }, 500);
        });

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
                    $scope.selectedAction = $scope.collections[index];
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

        // Add a new collection modal
        $scope.newCollection = function($event) {
            $modal.load('modal-new-collection.html', true, $scope, {});
        };

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
            console.log(data);
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.selectedAction = data.selectedAction.key
                    // $scope.addToCollection();
                    $modal.hide();
                });
            });
        };

        $scope.editCollection = function($event, name, id) {
            $modal.load('modal-edit-collection.html', true, $scope, { id: id, name: name });
        };

        $scope.deleteCollection = function($event, data) {
            ng.forEach( $scope.collections, function( value, key ) {
                if ( value.title === data.name ) {
                    $timeout(function(){
                        $scope.$apply(function(){
                            $scope.collections.splice(key, 1);
                        })
                    })
                }
            });

            ng.forEach( $scope.videos, function( value, key ) {
                ng.forEach( value.collections, function(value2, key2 ) {
                    if ( value2 === data.name ) {
                        $timeout(function(){
                            $scope.$apply(function(){
                                $scope.videos[key].collections.splice(key2, 1);
                            });
                        });
                    }
                });
            });
            $modal.hide();
        }

        $scope.addToCollection = function($event) {
            if ( $event ) {
                $event.preventDefault();
            }
            $timeout( function() {
                $scope.$apply(function() {

                    var cat = $scope.collections[$scope.selectedAction];

                    console.log( cat );

                    if ( $scope.dragItem !== undefined && $rootScope.isUnique( $scope.selectedItems, $scope.dragItem ) ) {
                        $scope.selectedItems.push( $scope.dragItem );
                    }

                    for ( var i = 0; i < $scope.selectedItems.length; i++ ) {
                        if ( $rootScope.isUnique( $scope.videos[$scope.selectedItems[i]].collections, $scope.selectedAction.title ) === true  ) {
                            $scope.videos[$scope.selectedItems[i]].collections.push($scope.selectedAction.title);
                            FlashService.flash( 'Successfully added ' + $scope.videos[$scope.selectedItems[i]].title + ' to ' + $scope.selectedAction.title, 'success' );
                        }
                    }
                    $scope.selectedItems = [];
                    $scope.$broadcast( 'dropdown-disabled' );
                    $scope.$broadcast( 'deselectAll' );
                });
            });
        };

        $scope.removeCollectionFromVideo = function($event, index, collection){
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
                col.push(value.label);
            });
            return col.join(', ');
        };

        $scope.updateCollection = function(data) {
            if ( data.name.length > 0 ) {
                $scope.collections[data.id].title = data.name;
                $modal.hide();
            }
        };

        // Save the new collection
        $scope.saveCollection = function(data) {
            if ( $rootScope.isUnique( $scope.collections, data.name ) ) {
                $scope.collections.push({
                    "title": data.name
                });
                $modal.hide();
            } else {

            }
        };

    }]);

    app.controller('AccountController', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$modal', 'FlashService', function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $modal, FlashService) {

        $scope.viewing = 'personal';
        $scope.user = {
            firstName: "David",
            lastName: "Woollard",
            username: "Darve",
            location: "United Kingdom",
            email: "dave@darve.co.uk",
            password: "davelol"
        };

        $scope.blueprint = {};
        ng.copy($scope.user, $scope.blueprint);

        $scope.checkEquals = function(blueprint,user) {
            return !ng.equals(blueprint,user);
        };

        // $scope.$watch('user', $scope.checkFormForChanges);

        $scope.accountNav = function (tab) {
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.viewing = tab;
                });
            });
        };

        $scope.checkFormForChanges = function() {

        };

        $scope.saveUser = function($event){
            $event.preventDefault();
            $timeout(function(){
                $scope.$apply(function(){
                    ng.copy($scope.user, $scope.blueprint);
                    FlashService.flash('User details saved', 'success');
                })
            })
        };

        $scope.changeUsername = function($event) {
            $modal.load('modal-change-username.html', true, $scope, { username: $scope.user.username });
        };

        $scope.saveUsername = function(data) {
            if ( data.username.length > 0 ) {
                $scope.user.username = data.username;
                $modal.hide();
            }
        };

        $scope.changeEmailAddress = function($event) {
            $modal.load('modal-change-email-address.html', true, $scope, { email: $scope.user.email });
        };

        $scope.saveEmailAddress = function(data) {
            if ( data.email.length > 0 ) {
                $scope.user.email = data.email;
                $modal.hide();
            }
        };

        $scope.changePassword = function($event) {
            $modal.load('modal-change-password.html', true, $scope, { password1: "", password2: "" });
        };

        $scope.savePassword = function(data) {
            if ( data.password1.length > 0 ) {
                if ( data.password1 == data.password2 ) {
                    $scope.user.password = data.password1;
                    $modal.hide();
                }
            }
        };
    }]);

    app.controller('UploadController', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', 'VideoService', function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, VideoService) {

        $scope.fileDropped = false;
        $scope.newVideo = {
            id: undefined,
            title: "",
            description: "",
            collections: ""
        }

        VideoService.getAll().then(function(data){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.collections = data.collections;
                    $scope.newVideo.collections = data.collections[0];
                });
            }, 500);
        });

        $scope.fileNameChanged = function() {
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.newVideo.id = Math.floor(Math.random() * 10) + parseInt(new Date().getTime()).toString(36);
                    $scope.fileDropped = true;
                    $timeout( function(){
                        $('.progress').css('width', '100%');
                    }, 1000);
                    $timeout(function(){
                        $('.bar').addClass('complete');
                        $('.percentage').html('Upload complete');
                    }, 11000);
                });
            });
        };

        $scope.$on('fileDropped', $scope.fileNameChanged);

        $scope.createVideo = function (data) {
            // $scope.videos[$scope.newVideo.id]
            var obj = {
                "title": $scope.newVideo.title,
                "description": $scope.newVideo.description,
                "category": $scope.newVideo.category,
                "collections": [$scope.newVideo.collections.title]
            };
            VideoService.save( $scope.newVideo.id, obj ).then(function(){
                $location.path('/library/');
            });
            console.log($scope.newVideo);
        };
    }]);

    app.controller('AnalyticsController', ['$scope', '$rootScope', '$routeParams', 'StatsService', 'VideoService', '$element', function ($scope, $rootScope, $routeParams, StatsService, VideoService, $element) {

        $scope.states = ['init', 'loading', 'complete', 'error'];

        $scope.sections = ['overview', 'performance', 'geographic', 'engagement'];
        $scope.section = $routeParams.type || 'overview';

        $scope.video = {
            videoID: $routeParams.videoID
        };

        $scope.data = {
            overview: null,
            performance: null,
            geographic: null,
            engagement: null
        };


        $scope.analytics = {
            dateRange: {
                from: moment().subtract('days', 7).toDate(),
                to: new Date()
            },
            results: [],
            key: null
        };

        $scope.setResults = function(key, keyDisplayName, dateFrom, dateTo, results) {
            $scope.analytics.key = key;
            $scope.analytics.keyDisplayName = keyDisplayName;
            $scope.analytics.dateRange.from = dateFrom;
            $scope.analytics.dateRange.to = dateTo;
            $scope.analytics.results = results;
        };

        $scope.flip = function() {
            $element.find('#analytics-bottom-panel').toggleClass('flip');
        };

        $scope.setSection = function (sectionName) {
            if (_.contains($scope.sections, sectionName)) {
                $scope.section = sectionName;
            }
        };

        $scope.isSection = function (sectionName) {
            return (_.isString(sectionName) && ($scope.section === sectionName));
        };

        $scope.setState = function (stateName) {
            if (_.contains($scope.states, stateName)) {
                $scope.state = stateName;
            }
        };

        $scope.isState = function (stateName) {
            return (_.isString(stateName) && ($scope.state === stateName));
        };

        $scope.setState('init');
        $scope.fields = StatsService.getFields();
        $scope.setState('loading');

        VideoService.getOne($routeParams.videoID).then(function(data) {
            $scope.setState('complete');
            $scope.video = data.videos[$routeParams.videoID];
            $scope.video.videoID = $routeParams.videoID;
        });

    }]);

    app.controller('VideoController', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$templateCache', '$compile', '$routeParams', '$q', function($scope, $rootScope, $http, $timeout, $location, $templateCache, $compile, $routeParams, $q) {

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


})(window,document,window.angular,'RomeoApp','controllers');