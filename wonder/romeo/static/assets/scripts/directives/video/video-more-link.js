angular.module('RomeoApp.directives')
  .directive('videoMoreLink', ['$templateCache', '$rootScope', function ($templateCache, $rootScope) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-more-link.html'),
    scope : {
      text : '=',
      url : '=',
      isEdit : '@'
    },
    controller : function ($scope) {

      $scope.remaining = 30;
      var maxLength = 30;

      $scope.$watch('text', function (newValue, oldValue) {
        console.log(newValue);
        if (newValue !== oldValue) {
          var newLength = newValue && newValue.length ? newValue.length : 0;
          $scope.remaining = maxLength - newLength;
          if ($scope.remaining < 0) {
            $scope.text = oldValue;
          }
        }
      });
      $scope.$watch('url', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          console.log(newValue);
          if (!newValue.match(/^http[s]?:\/\/.+/gi)) {
            if (newValue.match(/^http[s]?:\/\//gi)) {

              $scope.url = '';

            } else {

              if ($scope.url && $scope.url.toLowerCase() !== 'http://') {
                $scope.url = 'http://' + $scope.url;
              }
            }
          }
        }
      });

      $scope.save = function () {
        $rootScope.$emit('video-save');
        $scope.showMoreLinkConfigPanel = false;
      };
    }
  };
}]);