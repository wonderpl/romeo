
angular
  .module('RomeoApp.directives')
  .directive('profileVideoHero', ['$templateCache', 'UploadService', ProfileVideoHeroDirective]);

function ProfileVideoHeroDirective ($templateCache, UploadService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile-video-hero.html'),
    scope : {
      account : '='
    }
  };
}

