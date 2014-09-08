(function () {
'use strict';
var debug = new DebugClass('RomeoApp.profile.directives');

function editDetails($templateCache, $http) {
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/edit/edit-details.tmpl.html'),
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
      $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'width': '320px',
        'minimumInputLength': 3,
        'allowClear': true,
        'tokenSeparators': [','],
        ajax: {
          url: '/api/search_keywords',
          cache: true,
          quietMillis: 500,
          data: function (term, page) {
            return {prefix: term, size: 10, start: (page - 1) * 10};
          },
          results: function (data, page) {
            var result = {results: [], more: false};
            $.each(data.search_keyword.items || [], function() {
              result.results.push({id: this, text: this});
            });
            if (data.search_keyword.items.length == 10) {
              result.more = true;
            }
            return result;
          }
        },
        createSearchChoice: function (term) {
          return {id: term, text: term};
        },
        initSelection: function (element, callback) {
          var data = [];
          $(element.val().split(",")).each(function () {
            data.push({id: this, text: this});
          });
          callback(data);
        }
      };
      if ($scope.profile.search_keywords) {
        $scope.search_keywords = $scope.profile.search_keywords.split(',');
      }

      $scope.location_item = {id: $scope.profile.location};

      $scope.$watch('search_keywords', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          $scope.profile.search_keywords = newValue ? newValue.join(',') : '';
        }
      });
    },
    link: function (scope, element) {
      element.find('#profileJobTitle').autocomplete({
        source: function (request, callback) {
          $http.get('/api/user_titles?prefix=' + request.term).then(function (res) {
            callback(res.data.user_title.items);
          });
        },
        minLength: 2,
        delay: 500
      });
    }
  };
}
angular.module('RomeoApp.profile').directive('profileEditDetails', ['$templateCache', '$http', editDetails]);

function required($templateCache) {
  return {
    restrict : 'A',
    link: function ($element, $attr) {
      $scope.$watch(function () {
        return $element.text();
      }, function (newValue, oldValue) {
        if (!angular.equals(newValue, oldValue) && angular.isString($element.attr('ng-model'))) {
          var names = $element.attr('ng-model').split('.');
          if (names && names.length) {
            var name = names[names.length - 1];
            $scope.form.errors[name] = (angular.isString(newValue) && newValue.length > 0);
          }
          console.warn('Required value ' + $element.attr('ng-model') + ' changed to ' + newValue);
        }
      });
    }
  };
}
angular.module('RomeoApp.profile').directive('me-required', ['$templateCache', required]);


})();