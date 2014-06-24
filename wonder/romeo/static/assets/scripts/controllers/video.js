angular.module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {

  'use strict';

  var query = $location.search();

  console.log(query.token);

  $scope.color='#f00';

  $scope.text = 'primary secondary tertiary';

  $scope.$watch(
     // This is the listener function
     function() { return $scope.text; },
     // This is the change handler
     function(newValue, oldValue) {
       if ( newValue !== oldValue ) {
        console.log($scope.text);
       }
     }
   );


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
