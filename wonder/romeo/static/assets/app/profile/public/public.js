
angular
  .module('RomeoApp.profile')
  .directive('profilePublic', ['$templateCache', 'AccountService',
function ($templateCache, AccountService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/public/public.tmpl.html'),
    scope : {
      flags: '='
    },
    controller : function ($scope) {
      $scope.videos = [
        {title: 'Jaws', description: 'When a gigantic great white shark begins to menace the small island community of Amity, a police chief, a marine scientist and grizzled fisherman set out to stop it.', thumbnails: {
          items: [{
            height: '180',
            url: 'http://upload.wikimedia.org/wikipedia/commons/7/70/Menemsha.jpg'
          }]
        }},
        {title: 'Pumping Iron', description: 'From Gold\'s Gym in Venice Beach California to the showdown in Pretoria, amateur and professional bodybuilders prepare for the 1975 Mr. Olympia and Mr. Universe contests in this part-scripted, part-documentary film. Five-time champion Arnold Schwarzenegger defends his Mr. Olympia title against Serge Nubret and the shy young deaf Lou Ferrigno, whose father is his coach; the ruthless champ psyches out the young lion.' },
        {title: 'Donald Ducks Xmas', thumbnails: {
          items: [{
            height: '180',
            url: 'http://abstractatus.com/images/2013/08/disney-christmas-desktop-backgrounds-wallpixy.jpg'
          }]
        }, description: 'The six short animated films from the Walt Disney Studios share themes of wintertime and Christmas.'
      }
      ];
      $scope.collaborators = [
        {display_name: "Walt Disney", avatar: "http://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png"},
        {display_name: "Steven Spielberg", avatar: "http://i.telegraph.co.uk/multimedia/archive/00655/news-graphics-2008-_655878a.jpg"},
        {display_name: "Arnie", avatar: "http://resources1.news.com.au/images/2012/09/17/1226475/822425-arnie.jpg"}
      ];
      $scope.$watch('flags', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          $scope.collaborators.push({display_name: newValue.accountId});

          // AccountService.getCollaborators(newValue.accountId).then()...
        }
      }, true);
      $scope.$watch('videos', function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          setDefaultThumbnail(newValue);
        }
      });

      function getThumbnail(video) {
        var thumbs;
        if (angular.isDefined(video.thumbnails) && angular.isDefined(video.thumbnails.items) ) {
          thumbs = video.thumbnails.items;
          for (var i = 0; i < thumbs.length; ++i) {
            if (thumbs[i].height == 180) {
              return thumbs[i].url;
            }
          }
        }
        return '';
      }
      function setDefaultThumbnail(videos) {
        angular.forEach(videos, function (video, key) {
          video.thumbnail = getThumbnail(video);
        });
      }
      setDefaultThumbnail($scope.videos);
    }
  };
}
]);
