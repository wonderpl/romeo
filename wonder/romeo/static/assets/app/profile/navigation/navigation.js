
angular
  .module('RomeoApp.profile')
  .directive('profileNavigation', ['$templateCache',
    function ($templateCache) {
      'use strict';
      return {
        restrict : 'E',
        replace : true,
        template : $templateCache.get('profile/navigation/navigation.tmpl.html'),
        scope : {
          flags : '='
        },
        controller : function ($scope) {
          $scope.save = function () {
            if ($scope.flags.isFormValid)
              $scope.$emit('profile-save');
            else
              $scope.$emit('notify', {
                status : 'error',
                title : 'Save failed',
                message : "Couldn't save details, there was form errors"}
              );
          };
          $scope.cancel = function () {
            $scope.$emit('profile-cancel');
          };
        },
        link : function (scope, elem, attr) {
          var stickyClass = 'sub-navigation--sticky';
          $(window).scroll(function(e) {
            if (e.currentTarget.scrollY > 57) {
              elem.addClass(stickyClass);
            } else {
              elem.removeClass(stickyClass);
            }
          });
        }
      };
    }
  ]);
