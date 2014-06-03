angular.module('RomeoApp.directives').directive('plCheckbox', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    'use strict';

    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            scope.checked = false;
            scope.id = attrs.id;

            var toggle = function (event) {
                if (scope.checked) {
                    deselect({},scope.id);
                } else {
                    select({},scope.id);
                }
            };

            var select = function(e, id){
                if ( scope.id === id ) {
                    scope.$emit('checkboxChecked', true, attrs.id);
                    scope.checked = true;
                    elem.addClass('checked');
                }
            };

            var deselect = function(e, id){
                if ( scope.id === id ) {
                    scope.$emit('checkboxChecked', false, attrs.id);
                    scope.checked = false;
                    elem.removeClass('checked');
                }
            };

            var selectAll = function(){
                scope.checked = true;
                elem.addClass('checked');
            };

            var deselectAll = function(){
                scope.checked = false;
                elem.removeClass('checked');
            };

            // Bind and listen
            elem.bind('click', toggle);
            scope.$on('select', select);
            scope.$on('deselect', deselect);
            scope.$on('selectAll', selectAll);
            scope.$on('deselectAll', deselectAll);
        }
    };
}]);