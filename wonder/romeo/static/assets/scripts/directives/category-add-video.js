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

      scope.$watch(
        function() { return scope.selectedCategory; },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            scope.category = getCategoryById(scope.selectedCategory);
            scope.selectedName = scope.category ? scope.category.name : '';
          }
        }
      );

      function getCategoryById (id) {
        var categories = scope.categories;
        var category = null;
        var l = categories.length;
        while (l-- && !category) {
          if (categories[l].id === id) {
            category = categories[l];
          }
          var subcategories = categories[l].sub_categories;
          var k = subcategories.length;
          while (k-- && !category) {
            if (subcategories[k].id === id) {
              category = subcategories[k];
            }
          }
        }
        return category;
      }

      VideoService.getCategories().then(function (data) {
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
        };
        scope.setCategoryActive = function (categoryId) {
          scope.categoryActive = categoryId;
        };
        scope.removeCategory = function (id, $event) {
          scope.categoryActive = null;
          scope.selectedCategory = '';
          $event.stopPropagation();
        };
      });
    }
  };
}]);