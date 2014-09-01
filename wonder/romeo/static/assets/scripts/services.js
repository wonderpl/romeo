/*  Romeo Services
 /* ================================== */

(function () {
    'use strict';
    /*
    * Strips out newlines, tabs etc
    */
    angular.module('RomeoApp.services').factory('$sanitize', [function () {
        return function (input) {
            return input.replace('\n', '').replace('\t', '').replace('\r', '').replace(/^\s+/g, '');
        };
    }]);

})();
