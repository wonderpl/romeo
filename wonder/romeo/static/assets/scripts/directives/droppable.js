/*
* Used on the manage page for registering drop events
*/
angular.module('RomeoApp.directives').directive('plDroppable', ['DragDropService', function(DragDropService){

    'use strict';

    return {
        restict: 'A',
        link: function(scope, elem, attrs){

            elem.bind('mouseup', function(e){
                if ( DragDropService.isDragging() === true ) {
                    e.preventDefault();
                    elem.removeClass('highlight');
                    DragDropService.dragDrop(attrs.collection);
                }
            });

            elem.bind('mouseenter', function(e){
                if ( DragDropService.isDragging() === true ) {
                    elem.addClass('highlight');
                }
            });

            elem.bind('mouseleave', function(e){
                if ( DragDropService.isDragging() === true ) {
                    elem.removeClass('highlight');
                }
            });
        }
    };
}]);