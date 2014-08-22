angular.module('RomeoApp.profile.directives')

.directive('profileEditForm', ['$templateCache',
	function($templateCache) {
    'use strict';
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/directives/edit-form.tmpl.html'),
      scope : {
        flags : '=',
        form : '=',
        profile: '='
      },
      controller : function ($scope) {
			  $scope.$watch('profile.description', function (newValue, oldValue) {
			    if (! angular.equals(newValue, oldValue)) {
			      if (angular.isDefined(newValue))
			        $scope.form.error.Descrition = (newValue.length > 100) ? 'Description is to long' : '';
			    }
			  });
      },
    };
	}
]);