/*
* Used on the manage page for registering drag events
*/
angular.module('RomeoApp.directives').directive('plDraggable', ['DragDropService', function(DragDropService){

    'use strict';

    return {
        restrict: 'A',
        link: function(scope, elem, attrs){

            elem.bind('dragstart', function(e){
                e.preventDefault();
                DragDropService.dragStart( attrs.id );
            });

            elem.bind('mouseup', function(e){
                if ( DragDropService.isDragging() === true ) {

                }
            });

        }
    };
}]);