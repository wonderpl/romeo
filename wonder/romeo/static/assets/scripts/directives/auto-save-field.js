/*
* Description: Used on the upload page - broadcasts from the rootscope when the data changes
*/
angular.module('RomeoApp.directives').directive('autoSaveField', ['$rootScope', function($rootScope){

    'use strict';

    return {
        restict: 'A',
        link: function(scope, elem, attrs) {

            var saveInterval;

            var save = function(){
                $rootScope.$broadcast('autosave', elem.attr('data-model'), elem[0].innerHTML || elem.val(), new Date().toISOString());
            };

            elem.bind('focus', function() {
                if ( elem.hasClass('disabled') ){
                    elem.blur();
                } else {
                    saveInterval = setInterval( save, 30000 );
                    $rootScope.$broadcast('inputFocussed');
                }
            });

            elem.bind('blur', function() {
                if ( !elem.hasClass('disabled') ){
                    clearInterval( saveInterval );
                    save();
                }
            });

            elem.bind('keydown', function(e) {
                if ( elem.hasClass('disabled') ) {
                    e.preventDefault();
                }
            });
        }
    };
}]);