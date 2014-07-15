angular.module('RomeoApp.filters')
  .filter('time', function() {

  'use strict';

  return function(totalSeconds) {

    var minutes = Math.floor(totalSeconds/60);
    var seconds = Math.floor(totalSeconds - minutes*60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + seconds;
  };
});