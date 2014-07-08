angular.module('RomeoApp.directives')
  .directive('categoryAddVideo', ['$templateCache', 'VideoService', function ($templateCache, VideoService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('category-add-video.html'),
    scope : {
      selectedCategory : '='
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
        scope.selectCategory = function (id) {
          scope.selectedCategory = id;
        };
        scope.childCategorySelected = function (categoryId) {
          var childCategorySelected = false;
          var currentCategory = scope.selectedCategory;
          var categories = scope.categories;
          var l = categories.length;
          while (l--) {
            var category = categories[l];
            var subcategories = category.sub_categories;
            var j = subcategories.length;
            while (j--) {
              var subcategory = subcategories[j];
              if (subcategory.id === currentCategory) {
                if (category.id === categoryId) {
                  childCategorySelected = true;
                  return childCategorySelected;
                }
              }
            }
          }
          return childCategorySelected;
        };
        scope.setCategoryActive = function (categoryId) {
          scope.categoryActive = categoryId;
        };
      });
    }
  };
}]);