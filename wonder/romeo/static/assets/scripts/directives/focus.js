// http://stackoverflow.com/a/20685237
angular.module('RomeoApp.directives').directive('focus', ["$timeout", function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.focus, function (value) {
        if (value) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
}]);