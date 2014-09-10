angular.module('RomeoApp.filters')
  .filter('commaSeparatedList', function() {

  'use strict';

  return function(array) {

    if (!array) return;

    var string = '';

    for (var count = 0, total = array.length; count < total; count++) {

      if (typeof array[count] === 'string') {

        string += array[count];

      } else {

        string += array[count].label;
      }

      if (count + 1 < total) {

        string += ', ';
      }
    }

    return string;

  };
});