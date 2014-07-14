/*
* Used on the upload page in conjunction with the contenteditable pre tags
*/
angular.module('RomeoApp.directives').directive('plPlaceholder', ['$timeout', '$document', function ($timeout, $document) {

    'use strict';

    var i = $document.createElement('input'),
        support = ('placeholder' in i);
    if (support) return {};
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            if (attrs.type === 'password') {
                return;
            }
            $timeout(function () {
                elm.val(attrs.placeholder);
                elm.bind('focus', function () {
                    if (elm.val() === attrs.placeholder) {
                        elm.val('');
                    }
                });
                elm.bind('blur', function () {
                    if (elm.val() === '') {
                        elm.val(attrs.placeholder);
                    }
                });
            });
        }
    };
}]);
