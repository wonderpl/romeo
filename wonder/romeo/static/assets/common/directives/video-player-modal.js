//video-player-modal.js

(function () {
'use strict';

function VideoPlayerModal (modal) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {
            console.log('VideoPlayerModal link, attr: ', attr);
            console.warn(attr.videoPlayerModal);
            element.on('click', function () {
                modal.loadDirective(attr.videoPlayerModal, scope, { class: 'video-modal', small: true, element: 'video-player__iframe-container' });
            });
        }
    };
}

angular.module('RomeoApp.directives')
  .directive('videoPlayerModal', ['modal', VideoPlayerModal]);
})();