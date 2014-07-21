angular.module('RomeoApp.controllers')
  .controller('OrganiseCtrl', ['$scope', 'TagService', '$location',
  function($scope, TagService, $location) {

    'use strict';

    var redirect = function (path) {
      var url = '/organise/' + path;
      $location.path(url, false);
    };

    TagService.getTags().then(function(data){
      console.log(data);
      $scope.tags = data.tag.items;
    });

    $scope.$on('show-collection', function ($event, id) {
      console.log(id);
      redirect(id);
    });

}]);
