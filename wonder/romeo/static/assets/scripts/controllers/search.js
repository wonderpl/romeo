angular.module('RomeoApp.controllers')
  .controller('SearchCtrl', ['$scope', '$location', 'SearchService',
    function($scope, $location, SearchService) {
  'use strict';
  var debug = new DebugClass('SearchCtrl');

  var data = $location.search();

  if (!$.isEmptyObject(data)) {
    search(data);
    $scope.search = $scope.search || {};
    $scope.search.expression = data;
    $scope.query = data ? data.q : null;
  }

  function clearSearch () {
    $scope.search.results = null;
    $scope.search.expression = null;
    $location.url($location.path());
  }

  function search (expression) {
    console.log($scope.country);
    return SearchService.search(expression).then(function (data) {
      $scope.search.results = data;
    }, assignMockData);
  }

  $scope.$on('search', function ($event, data) {
    $event.stopPropagation();
    $scope.query = data ? data.q : null;
    search(data);
  });

  $scope.$watch('search.country', function (newValue, oldValue) {
    if (newValue && newValue !== oldValue) {
      search(data);
    }
  }, true);


  $scope.$watch('search.expression', function (newValue, oldValue) {
    if ((newValue && !newValue.q) || (newValue && newValue.q && newValue.q.trim() === '')) {
      clearSearch();
    } else if (newValue != oldValue && newValue && newValue.q) {
      search(newValue);
    }
  }, true);

  function assignMockData () {

    $scope.search = $scope.search || {};

    $scope.search.results = {

      "video": {
        "total": 2,
        "items": [
          {
            "id": 34489679,
            "href": "/api/video/34489679",
            "date_added": "2014-03-27 13:49:19",
            "date_updated": "2014-03-28 15:58:04",
            "status": "processing",
            "title": "test",
            "category": null,
            "description": "In adipiscing eros eget justo ullamcorper, vitae lacinia arcu iaculis. Nullam mi lectus, posuere quis sagittis eu, ultricies non lorem. Vestibulum eu nibh id nunc malesuada commodo. ",
            "thumbnails": {
             "items": []
            },
            "tags": {
             "href": "/api/video/34489679/tags",
             "items": []
            }
          },
          {
            "id": 34489679,
            "href": "/api/video/34489679",
            "date_added": "2014-03-27 13:49:19",
            "date_updated": "2014-03-28 15:58:04",
            "status": "processing",
            "title": "test",
            "category": null,
            "description": "In adipiscing eros eget justo ullamcorper, vitae lacinia arcu iaculis. Nullam mi lectus, posuere quis sagittis eu, ultricies non lorem. Vestibulum eu nibh id nunc malesuada commodo. ",
            "thumbnails": {
             "items": []
            },
            "tags": {
             "href": "/api/video/34489679/tags",
             "items": []
            }
          },
          {
            "id": 34489679,
            "href": "/api/video/34489679",
            "date_added": "2014-03-27 13:49:19",
            "date_updated": "2014-03-28 15:58:04",
            "status": "processing",
            "title": "test",
            "category": null,
            "description": "In adipiscing eros eget justo ullamcorper, vitae lacinia arcu iaculis. Nullam mi lectus, posuere quis sagittis eu, ultricies non lorem. Vestibulum eu nibh id nunc malesuada commodo. ",
            "thumbnails": {
             "items": []
            },
            "tags": {
             "href": "/api/video/34489679/tags",
             "items": []
            }
          }
        ]
      },
      "content_owner": {
        "total": 2,
        "items": [
         {
            "href": "/api/account/27250600",
            "name": "romeo account name",
            "display_name": "dolly user name",
            "description": "dolly profile description",
            "profile_cover": "http://path/to/dolly/profile/cover.jpg",
            "avatar": "http://path/to/dolly/avatar/image.jpg"
          },
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
        "total": 5,
        "items": [
          {
            "username": "Paul Egan1",
            "avatar_url": "http://path/to/small/avatar/img.png",
            "permissions": ["can_comment"],
            "description": "Donec quis elit risus. In eget nisl eget augue mattis vehicula."
          },
          {
            "username": "Paul Egan2",
            "avatar_url": "http://path/to/small/avatar/img.png",
            "permissions": ["can_comment"],
            "description": "Donec quis elit risus. In eget nisl eget augue mattis vehicula."
          },
          {
            "username": "Paul Egan3",
            "avatar_url": "http://path/to/small/avatar/img.png",
            "permissions": ["can_comment"],
            "description": "Donec quis elit risus. In eget nisl eget augue mattis vehicula."
          },
          {
            "username": "Paul Egan4",
            "avatar_url": "http://path/to/small/avatar/img.png",
            "permissions": ["can_comment"],
            "description": "Donec quis elit risus. In eget nisl eget augue mattis vehicula."
          },
          {
            "username": "Paul Egan5",
            "avatar_url": "http://path/to/small/avatar/img.png",
            "permissions": ["can_comment"],
            "description": "Donec quis elit risus. In eget nisl eget augue mattis vehicula."
          }
        ]
      }
    };
  }

}]);