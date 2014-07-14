angular.module('RomeoApp.directives').directive('plUploadDropzone', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    'use strict';
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {

            scope.reader = new FileReader();

            scope.reader.onloadend = function (e, file) {
                console.log(e.target.result);
            };

            elem.bind('dragover', function (e) {
                e.preventDefault();
            });

            elem.bind('dragend', function (e) {
                e.preventDefault();
            });

            elem.bind('drop', function (e) {
                e.preventDefault();
                var dt = e.dataTransfer,
                    file = dt.files[0];
            });

        }
    };
}]);