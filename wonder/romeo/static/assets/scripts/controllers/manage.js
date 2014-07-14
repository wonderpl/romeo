angular.module('RomeoApp.controllers').controller('ManageCtrl',
    ['$scope', '$rootScope', '$timeout', '$modal', 'VideoService', 'TagService', '$routeParams', '$q',
    function ($scope, $rootScope, $timeout, $modal, VideoService, TagService, $routeParams, $q) {

    'use strict';

    /*
    * State object representing how the videos are filtered
    */
    $scope.filters = {
        "none": {
            slug: "none",
            name: ""
        },
        "uploads": {
            slug: "uploads",
            name: "Uploads in progress"
        },
        "recent": {
            slug: "recent",
            name: "Recent videos"
        },
        "collection": {
            slug: "collection"
        }
    };

    /*
    * The text used to filter the results
    */
    $scope.searchText = '';

    /*
    * Grab the filter parameter from the URL and change the filter
    */
    TagService.getTags().then(function(response){
        if ( 'filter' in $routeParams ) {
            $scope.initialiseFilter([$routeParams.filter]).then(function(response) {
                $scope.currentFilter = response;
            });
        }
        // $scope.currentFilter = 'filter' in $routeParams ? $timeout(function(){$scope.changeFilter([$routeParams['filter']])}) : $scope.filters["none"];
    });


    /*
    * Function to change the filter
    */
    $scope.initialiseFilter = function(filter) {

        var deferred = new $q.defer();
        var newFilter = {};

        newFilter = ng.copy($scope.filters[filter]);
        newFilter.id = 'id' in $routeParams ? $routeParams.id : "";

        if ( typeof(newFilter.name) === undefined ) {
            TagService.getLabel(newFilter.id).then(function(response){
                newFilter.name = response;
                deferred.resolve(newFilter);
            });
        }
        return deferred.promise;
    };

    /*
    * Change the filter
    */
    $scope.changeFilter = function(filter) {
       // $scope.currentFilter = 'filter' in $routeParams ? $timeout(function(){$scope.changeFilter([$routeParams['filter']])}) : $scope.filters["none"];
    };

    /*
    * Shows the 'add new collection modal'
    */
    $scope.showAddNewCollectionForm = function(pub) {
        $modal.load('modal-new-collection.html', true, $scope, { label: "", description: "", public: pub });
    };

    /*
    * Submits the 'add new collection' form and makes a request to the web services.
    */
    $scope.submitAddNewCollectionForm = function(data) {
        $modal.hide();
        TagService.createTag({
            label: data.label,
            description: data.description,
            public: data.public
        }).then(function(response){
            TagService.getTags();
        });
    };

    /*
    * Show add to collection form
    */
    $scope.showAddToCollectionForm = function(id) {
        $modal.load('modal-add-to-collection.html', true, $scope, { id: id, chosenTag: undefined, tags: $rootScope.Tags });
    };

    /*
    * Submits the 'add to a collection' form and makes a request to the web services
    */
    $scope.submitAddToCollectionForm = function(data) {
        $modal.hide();
        VideoService.addToCollection(data.id, data.chosenTag.id).then(function(response){
            console.log('SUCCESS');
        });
    };

    /*
    * Listen for the dragStarted event
    */
    $scope.$on('dragStarted', function (e, index) {
        console.log('dragStarted event caught by controller');
    });

    /*
    * Listen for the dragDropped event
    */
    $scope.$on('dragDropped', function (e, index) {
        console.log('dragDropped event caught by controller');
    });

    /*
    * Listen for the dragCancelled event
    */
    $scope.$on('dragCancelled', function (e, index) {
        console.log('dragCancelled event caught by controller');
    });

    /*
    * Initialise the video service
    */
    $scope.$on('get videos', function(){
        VideoService.getAll();
    });

    /*
    * Initalise the tag service
    */
    $scope.$on('get tags', function(){
        TagService.getAll();
    });

}]);