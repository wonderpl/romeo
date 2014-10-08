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

    
    angular.module('RomeoApp.services').factory('Enum', function () {

        function Enum() {
            var states = Array.prototype.slice.apply(arguments, [0]);
            for (var i = 0, j = states.length; i < j; i++) {
                this[states[i].toUpperCase()] = i;
            }
        }

        return Enum;
    });

})();
