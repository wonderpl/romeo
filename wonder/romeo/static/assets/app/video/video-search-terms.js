(function () {
  'use strict';

  function VideoSearchTerms($templateCache) {
      return {
        restrict : 'E',
        replace : true,
        template : $templateCache.get('video-search-terms.html'),
        scope: {
            video: '=',
            flags: '=',
            addSearchTermsShow: '='
        },
        controller : function ($scope) {
          $scope.select2Options = {
            'multiple': true,
            'simple_tags': true,
            'width': '100%',
            'minimumInputLength': 3,
            'allowClear': true,
            'tokenSeparators': [','],
            'ajax': {
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
            'initSelection': function (element, callback) {
              var data = [];
              $(element.val().split(",")).each(function () {
                data.push(this);
              });
              callback(data);
            }
          };
        }
      };
  }
  angular.module('RomeoApp.directives')
    .directive('videoSearchTerms', ['$templateCache', VideoSearchTerms]);

})();