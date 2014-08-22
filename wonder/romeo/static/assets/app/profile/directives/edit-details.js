angular.module('RomeoApp.profile.directives')

.directive('profileEditDetails', ['$templateCache',
	function($templateCache) {
    'use strict';
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/directives/edit-details.tmpl.html'),
      scope : {
        flags : '=',
        profile: '='
      },
      controller : function ($scope) {
        $scope.form = {
          valid: true,
          errors: {},
          errorMsg: function () {
            var errorMsg = '',
                sep = '';
            angular.forEach($scope.form.errors, function(value, key) {
              errorMsg += sep + value;
              sep = ', '; 
            });
            return errorMsg;
          }
        };

			  $scope.$watch('profile.description', function (newValue, oldValue) {
			    if (! angular.equals(newValue, oldValue)) {
			      if (angular.isDefined(newValue)) {
              var textValue = $('<p>' + newValue + '</p>').text();
			        $scope.form.errors.description = (textValue.length > 100) ? 'Description is to long' : void(0);
            }
			    }
			  });
        $scope.$watch('form.errors', function (newValue, oldValue) {
          if (! angular.equals(newValue, oldValue)) {
            var isValid = true;
            angular.forEach(newValue, function (value, key) {
              if (angular.isDefined(value))
                isValid = false;
            });
            console.log('Errors updated form is now ' + (isValid ? 'valid' : 'INVALID'));
            $scope.form.valid = isValid;
          }
        }, true);
        $scope.$watch('form.valid', function (newValue, oldValue) {
          if (! angular.equals(newValue, oldValue)) {
            $scope.flags.isFormValid = newValue;
          }
        });
      }
    };
	}
]);