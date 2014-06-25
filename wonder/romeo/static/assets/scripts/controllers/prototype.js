angular.module('RomeoApp.controllers')
  .controller('PrototypeCtrl', ['$rootScope', '$scope', '$location', 'AuthService', function($rootScope, $scope, $location, AuthService) {

  'use strict';

  var query = $location.search();

  console.log(query.token);

  $scope.color='#f00';

  var testText = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo ante eu nunc pulvinar, vulputate interdum mauris posuere. Cras semper lectus sit amet lorem eleifend, sit amet fringilla libero facilisis. Mauris id quam tincidunt, luctus arcu nec, interdum tortor.</p><h2>This is an H2 heading</h2><p>Mauris euismod, nisl sit amet vehicula dapibus, magna augue faucibus enim, non egestas ante enim in tellus. Aliquam vulputate magna auctor nisi auctor elementum. Pellentesque eros dolor, fermentum pulvinar consectetur ut, luctus quis nulla. Aliquam euismod imperdiet auctor. Vestibulum ullamcorper quam in nulla sagittis gravida. Vivamus sodales nulla tempor magna viverra, at luctus mi congue.</p><h3>This is an H3 heading</h3><p><strong>This is bold text</strong></p><p><em>This is italicized text</em></p><p><u>This is underlined text</u></p><p><a href="#">This is a link</a></p><p>Suspendisse in urna pellentesque, vestibulum risus sit amet, facilisis sapien. Integer tempus, tellus eu molestie congue, mi nisi pharetra eros, vel auctor neque nibh vitae ligula. Aenean vitae placerat urna.</p><p>Integer faucibus lacinia venenatis. In hac habitasse platea dictumst. Maecenas quis ligula metus. Nam eget imperdiet lectus, a accumsan leo. Nulla bibendum et nibh eu molestie. Pellentesque porttitor sem nec sapien consectetur, ut dictum nibh porta.</p><p>Maecenas gravida gravida mi placerat varius. <strong>Bold</strong>. Quisque at dui at odio tristique volutpat sed vel nibh. <em>Italics</em>. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. <a href="#">Link</a>. Aenean placerat faucibus massa vitae dapibus. <u>Underlined</u>. Curabitur felis lectus, egestas nec ornare nec, vehicula id arcu.</p>';

  $scope.text = testText;

  $scope.more = '<a href="http://bbc.co.uk">bbc</a>';

  var isEdit;

  var isReview;

  var isComments;

  $scope.isEdit = false;

  $scope.isReview = false;

  $scope.isComments = true;

  $scope.hasVideo = false;

  $scope.displaySection = function (section) {

    switch (section) {
      case 'edit':
        $scope.isEdit = true;
        $scope.isReview = $scope.isComments = false;
      break;
      case 'comments':
        $scope.isComments = true;
        $scope.isReview = $scope.isEdit = false;
      break;
      default:
        $scope.isReview = true;
        $scope.isEdit = $scope.isComments = false;
      break;
    }
  };

  $scope.isUploading = false;

  /***************
   COMMENTS STUFF
  ****************/

  $scope.$watch(
     // This is the listener function
     function() { return $scope.text; },
     // This is the change handler
     function(newValue, oldValue) {
       if ( newValue !== oldValue ) {
        console.log($scope.text);
       }
     }
   );


  $scope.comments = [
    { id : '1', name : 'aristotle onassis', mark : 25, posted : 1397433600, comment : ' It is during our darkest moments that we must focus to see the light.' },
    { id : '2', name : 'helen keller', mark : 45, posted : 1404021600, comment : 'The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.'},
    { id : '3', name : 'ronald reagan', mark : 45, posted : 1403875800, comment : 'We can&apos;t help everyone, but everyone can help someone.'},
    { id : '4', name : 'theodore roethke', mark : 65, posted : 1403827200, comment : 'What we need is more people who specialize in the impossible.'},
    { id : '5', name : 'morgan freeman', mark : 80, posted : 1403707834, comment : 'Learning how to be still, to really be still and let life happen - that stillness becomes a radiance.'}
  ];

  var frames = document.getElementsByClassName('video-player__frame');

  if (frames.length) {

    var frame = frames[0].contentWindow;

    frame.onload = function () {

      var OO = frame.OO || {};

      OO.ready(function () {
        $scope.player = frame.player;
        bindEvents(OO);
      });
    };
  }

  $scope.videoCurrentTime = 0;

  $scope.videoTotalTime = 0;

  // http://support.ooyala.com/developers/documentation/concepts/xmp_securexdr_view_mbus.html
  // http://support.ooyala.com/developers/documentation/api/player_v3_api_events.html
  function bindEvents (OO) {

    var bus = $scope.player.mb;

    bus.subscribe(OO.EVENTS.PLAYBACK_READY, 'WonderUIModule', function () {

      $scope.videoTotalTime = $scope.player.getTotalTime();

      bus.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'WonderUIModule', function(eventName, currentTime) {

        $scope.videoCurrentTime = currentTime;

        // console.log(currentTime + ' (' + Math.round(progress) + '%)');

        $scope.progress = (Math.round((($scope.videoCurrentTime * 1000)/$scope.videoTotalTime) * 100 * 100))/100;

        $scope.$apply();

      });

      bus.subscribe(OO.EVENTS.SEEKED, 'WonderUIModule', function (seconds) {

        $scope.player.pause();
      });

    });
  }

  /********************
   END COMMENTS STUFF
  *********************/

  AuthService.loginAsCollaborator(query.token).then(function(data){
    if (data.authenticatedAsOwner) {

      // show comments

      // allow edit/review/comments

      $rootScope.isOwner = true;

    } else if (data.authenticatedAsCollaborator) {

      // show comments

      // allow review/comments

      $rootScope.isCollaborator = true;

    } else {

      // redirect to 400 not authenticated
    }
  }, function(err){

    console.log(err);

  });

}]);
