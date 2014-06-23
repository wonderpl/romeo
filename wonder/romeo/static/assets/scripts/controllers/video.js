angular.module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$location', 'AuthService', function($location, AuthService) {

  'use strict';

  var query = $location.search();

  console.log(query.token);

  AuthService.loginAsCollaborator(query.token).then(function(data){
    if (data.authenticatedAsOwner) {

      // show everything

    } else if (data.authenticatedAsUserWithAccess) {

      // show video with comments

    } else if (data.authenticatedAsCollaborator) {

      // show video with comments

    } else {

      // redirect to 400 not authenticated
    }
  }, function(err){
    console.log(err);
  });

}]);
