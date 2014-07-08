angular.module('RomeoApp.filters')
  .filter('videoPriority', function() {
    return function(categories) {
      var filtered = [];
      var l = categories.length;
      while (l--) {
        if (categories[l].priority !== -1) {
          filtered.push(categories[l]);
        }
      }
      return categories;
    };
  })