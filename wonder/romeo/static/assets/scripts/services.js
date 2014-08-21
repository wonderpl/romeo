/*  Romeo Services
 /* ================================== */

(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [] /* module dependencies */);

    /*
    * Strips out newlines, tabs etc
    */
    app.factory('$sanitize', [function () {
        return function (input) {
            return input.replace('\n', '').replace('\t', '').replace('\r', '').replace(/^\s+/g, '');
        };
    }]);

})(window, document, window.angular, 'RomeoApp', 'services');
