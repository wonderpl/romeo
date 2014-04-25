
/*  Romeo Directives
/* ================================== */

(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [ns + '.services'] /* module dependencies */);

    app.directive('plPlaceholder', ['$timeout', function ($timeout) {
        var i = d.createElement('input'),
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


    app.directive('plContentEditablePlaceholder', [function(){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs){

                var el = d.createElement('span');
                
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

            }
        }
    }]);


    app.directive('plDisabled', [function(){
        return {
            restrict: 'C',
            link: function(scope, elem, attrs){
                elem.bind('focus', function(e){
                    elem[0].blur();
                });
            }
        }
    }]);
    

    app.directive('plDraggable', ['DragDropService', function(DragDropService){
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
        }
    }]);

    app.directive('plDroppable', ['DragDropService', function(DragDropService){
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
        }
    }]);

    app.directive('plTooltip', ['$tooltip', function($tooltip){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs){
                elem.bind('mouseenter', function(e){
                    if ( attrs.plTooltip.length > 0 ) {
                        $tooltip.show(attrs.plTooltip, elem[0]);    
                    }
                });
                elem.bind('mouseleave', function(e){
                    $tooltip.hide();
                });
            }
        }
    }]);

    app.directive('plProgressButton', [function(){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs){
                    

            }
        }
    }]);    

    app.directive('plFocusField', ['$timeout', function($timeout){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs){
                $timeout(function(){
                    elem[0].focus();
                });
            }
        }
    }]);

    app.directive('uploadFileInput', ['$timeout', '$rootScope', function($timeout, $rootScope){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs){
                
                elem.bind('change', function(e){
                    $rootScope.$broadcast('fileSelected', e);
                });
            }
        }
    }]);

    app.directive('plCheckbox', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        return {
            restrict: 'C',
            link: function (scope, elem, attrs) {
                scope.checked = false;
                scope.id = attrs.id;

                var toggle = function (event) {
                    scope.checked ? deselect({},scope.id) : select({},scope.id);
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

    app.directive('quickShare', ['$rootScope', '$timeout', '$templateCache', function($rootScope, $timeout, $templateCache) {
        return {
            restrict: 'E',
            template: $templateCache.get('upload-quick-share.html'),
            link: function (scope, elem, attrs) {
                console.log('initialised');
            }
        }
    }]);

    app.directive('quickShareRecipients', ['$rootScope', '$timeout', '$templateCache', function($rootScope, $timeout, $templateCache) {
        return {
            restrict: 'A',
            template: $templateCache.get('upload-quick-share-recipients.html'),
            link: function (scope, elem, attrs) {
                console.log('recipients initialised');
            }
        }
    }]);

    app.directive('plUploadDropzone', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
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
                        console.log(scope.reader);
                    // scope.reader.readAsDataURL(file);
                    // console.log(scope.reader);
                    // scope.$emit('fileDropped');
                });

            }
        };
    }]);

    app.directive('plToolbarDropdown', [function(){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                scope.$on('dropdown-enabled', function(event){
                    elem[0].disabled = false;
                });

                scope.$on('dropdown-disabled', function(event){
                    elem[0].disabled = true;
                });

            }
        }
    }]);

    app.directive('plLoader', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="pl-loader loading"></div>'
        };
    });

    // app.directive('directiveTemplate', ['$rootScope', '$timeout', function($rootScope, $timeout){
    //     return {
    //         restrict: 'E',
    //         link: function(scope, elem, attrs) {
    //         }
    //     };
    // }]);

})(window, document, window.angular, 'RomeoApp', 'directives');