angular.module('RomeoApp.controllers')
  .controller('SearchCtrl', ['$scope', '$location', 'SearchService',
    function($scope, $location, SearchService) {
  'use strict';
  var debug = new DebugClass('SearchCtrl');

  var data = $location.search();

  if (!$.isEmptyObject(data)) {
    if (data.q) {
      search(data);
    }
    $scope.q = data.q;
    $scope.location = data.location;
  }

  function clearSearch () {
    $scope.results = null;
    $scope.q = null;
    $location.url($location.path());
  }

  function search (expression) {
    console.log($scope.location);
    return SearchService.search(expression).then(function (data) {
      $scope.results = data;
    }, assignMockData);
  }

  $scope.$on('search', function ($event, data) {
    $event.stopPropagation();
    if (data.q) {
      search({
        q : data.q,
        location: data.location
      });
    }
  });

  $scope.$watch('location', function (newValue, oldValue) {
    if (newValue && newValue !== oldValue) {
      if (data.q) {
        search({
          location: newValue,
          q : $scope.q
        });
      }
    }
  }, true);


  $scope.$watch('q', function (newValue, oldValue) {
    if (!newValue || newValue.trim() === '') {
      clearSearch();
    } else if (newValue && newValue != oldValue) {
      console.log($scope.location);
      search({
        location: $scope.location,
        q : $scope.q
      });
    }
  }, true);

  function assignMockData () {

    $scope.results = {

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