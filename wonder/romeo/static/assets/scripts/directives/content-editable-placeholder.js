/*
* Used on the upload page for Medium-style editable fields that grow in height
*/
angular.module('RomeoApp.directives').directive('plContentEditablePlaceholder', ['$timeout', '$document', function($timeout, $document){

    'use strict';

    return {
        restrict: 'A',
        link: function(scope, elem, attrs){

            var el = document.createElement('span');

            elem.attr('spellcheck', 'false');

            el.className = "placeholder";
            el.innerHTML = attrs.placeholder;
            elem.parent().append(el);

            elem.bind('keydown', function(e){
                el.style.display = 'none';
            });

            elem.bind('keyup, blur', function(e){
                if ( elem[0].innerHTML.length > 0 ) {
                    el.style.display = 'none';
                } else {
                    el.style.display = 'block';
                }
            });

            if ( elem[0].innerHTML.length > 0 ) {
                el.style.display = 'none';
            }

            scope.$on('update autosave fields', function(e){
                $timeout( function() {
                    if ( elem[0].innerHTML.length > 0 ) {
                        el.style.display = 'none';
                    }
                }, 300);
            });

        }
    };
}]);