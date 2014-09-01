angular.module('RomeoApp.filters')
  .filter('nonCollaborators', function() {

  'use strict';

  return function(collaborators) {

    console.log(collaborators);

    var l = collaborators.length;

    var connections = [];

    while (l--) {

      if (collaborators[l].user) {

        console.log(collaborators[l]);

        connections.push(collaborators[l]);
      }
    }

    return connections;

  };
});