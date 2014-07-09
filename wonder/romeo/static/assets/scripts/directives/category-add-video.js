angular.module('RomeoApp.directives')
  .directive('categoryAddVideo', ['$templateCache', 'VideoService', function ($templateCache, VideoService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('category-add-video.html'),
    scope : {
      selectedCategory : '=',
      showCategory : '='
    },
    link : function (scope, element, attrs) {
      VideoService.getCategories().then(function (data) {
        console.log(data);
        var categories = [];
        var items = data.category.items;
        var l = items.length;
        while (l--) {
          var item = items[l];
          if (item.priority !== -1) {
            categories.push(item);
          }
        }
        scope.categories = categories;
        scope.selectCategory = function (id, $event) {
          scope.selectedCategory = id;
          scope.selectedName = $event.currentTarget.innerHTML;
        };
        scope.setCategoryActive = function (categoryId) {
          scope.categoryActive = categoryId;
        };
        scope.removeCategory = function (id, $event) {
          scope.categoryActive = null;
          scope.selectedCategory = null;
          $event.stopPropagation();
        };
      });
    }
  };
}]);