angular.module('RomeoApp.controllers').controller('AnalyticsCtrl',
    ['$scope', '$routeParams', '$element', 'Enum', 'AnalyticsFields', 'VideoService',
    function ($scope, $routeParams, $element, Enum, AnalyticsFields, VideoService) {

    'use strict';

    // ---- Functions ----

    function getVideoData(videoID) {
        analytics.state = States.LOADING;
        return VideoService.getOne(videoID).then(function (videoData) {
            console.log(videoData);
            analytics.state = States.COMPLETE;
            //TODO This needs correcting...
            return videoData;
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
