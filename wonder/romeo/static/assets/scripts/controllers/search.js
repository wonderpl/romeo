angular.module('RomeoApp.controllers')
  .controller('SearchCtrl', ['$scope', 'SearchService', 'AccountService', function($scope, SearchService, AccountService) {
  'use strict';
  var debug = new DebugClass('SearchCtrl');

  debug.log('test');

  function loadUserDetails () {
    AccountService.getUser().then(function (data) {
      $scope.profile = data;
    });
  }

  loadUserDetails();

  function search (expression) {
    return SearchService.search(expression).then(function (data) {
      $scope.search.results = data;

    }, function () {

      $scope.search.results = {

        "video": {
          "total": 1,
          "items": [
            {
              "id": 34489679,
              "href": "/api/video/34489679",
              "date_added": "2014-03-27 13:49:19",
              "date_updated": "2014-03-28 15:58:04",
              "status": "processing",
              "title": "test",
              "category": null,
              "thumbnails": {
               "items": []
              },
              "tags": {
               "href": "/api/video/34489679/tags",
               "items": []
              }
            },
          ]
        },
        "content_owner": {
          "total": 1,
          "items": [
           {
             "href": "/api/account/27250600",
             "name": "romeo account name",
             "display_name": "dolly user name",
             "description": "dolly profile description",
             "profile_cover": "http://path/to/dolly/profile/cover.jpg",
             "avatar": "http://path/to/dolly/avatar/image.jpg"
            }
          ]
        },
        "collaborator": {
          "total": 1,
          "items": [
            {
              "username": "Paul Egan",
              "avatar_url": "http://path/to/small/avatar/img.png",
              "permissions": ["can_comment"]
            }
          ]
        }
      };

    });
  }

  $scope.$on('search', function ($event, data) {
    $event.stopPropagation();
    search(data);
  });

  $scope.$watch('search.expression', function (newValue, oldValue) {
    if ((newValue && !newValue.q) || (newValue && newValue.q && newValue.q.trim() === '')) {
      $scope.search.results = null;
      $scope.search.expression = null;
    } else if (newValue != oldValue && newValue && newValue.q) {
      search(newValue);
    }
  }, true);

}]);