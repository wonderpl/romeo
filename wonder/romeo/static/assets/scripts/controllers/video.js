angular.module('fileUpload', [ 'angularFileUpload' ]);

angular
  .module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$http', '$scope', '$location', '$upload', 'UploadService', '$routeParams', 'VideoService', '$sce', 'TagService', 'CommentsService', '$timeout', 'AccountService', 'AuthService', VideoCtrl]);

function VideoCtrl ($rootScope, $http, $scope, $location, $upload, UploadService, $routeParams, VideoService, $sce, TagService, CommentsService, $timeout, AccountService) {

  'use strict';

  function persistVideoData (data) {
    angular.extend($scope.video, data);
  }

  function initialiseNewScope () {

    $scope.video = $scope.video || {};
    $scope.titlePlaceholder = 'Untitled Video';
    $scope.straplinePlaceholder = 'Subtitle';
    $scope.descriptionPlaceholder = 'Additional content including but not limited to: recipes, ingredients, lyrics, stories, etc.';
    $scope.showUpload = true;
    $scope.hasProcessed = false;
    $scope.videoHasLoaded = false;
    $scope.embedUrl = '';
    $scope.currentTime = 0;
    $scope.notified = false;
    $scope.isOwner = false;

    $scope.videoCurrentTime = 0;
    $scope.videoTotalTime = 0;

    $scope.isEdit = false;
    $scope.isReview = false;
    $scope.isComments = false;

    TagService.getTags().then(function (data) {
      $scope.tags = data.tag.items;
    });
  }

  /*
   * Trim trailing and leading spaces
   * Should probably be kept somewhere else
   * http://stackoverflow.com/questions/10032024/how-to-remove-leading-and-trailing-white-spaces-from-a-given-html-string
   *
   */
  function trim (str) {
    return str ? str.replace(/^[ ]+|[ ]+$/g,'') : str;
  }

  function stripExtension (value) {
    return value.substr(0, value.lastIndexOf('.'));
  }

  $scope.$watch(
    function() { return $scope.video.category; },
    function(newValue, oldValue) {
      $scope.video.category = $scope.video.category || '';
    }
  );

  $scope.$watch(
    function() { return $scope.video.title; },
    function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.titlePlaceholder = 'Untitled Video';
        if (trim(newValue)) {
          $timeout(function() {
            $scope.titlePlaceholder = '';
          });
        }
      }
    }
  );

  $scope.$watch(
    function() { return $scope.video.strapline; },
    function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.straplinePlaceholder = 'Subtitle';
        if (trim(newValue)) {
          $timeout(function() {
            $scope.straplinePlaceholder = '';
          });
        }
      }
    }
  );

  $scope.$watch(
    function() { return $scope.video.description; },
    function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.descriptionPlaceholder = 'Additional content including but not limited to: recipes, ingredients, lyrics, stories, etc.';
        if (trim(newValue)) {
          $timeout(function() {
            $scope.descriptionPlaceholder = '';
          });
        }
      }
    }
  );

  $scope.$watch(
    function() { return $scope.video ? $scope.video.id : null; },
    function(newValue, oldValue) {
      if (newValue !== '' && newValue !== oldValue) {
        CommentsService.getComments(newValue).then(function (data) {
          $scope.comments = data.comment.items;
        });
      }
    }
  );

  $scope.onPreviewImageSelect = function (files) {
    VideoService.saveCustomPreview($scope.video.id, files[0]).then(function(data){
      angular.extend($scope.video, data);
      $scope.loadVideo($scope.video.id);
      $scope.showPreviewSelector = false;
      $scope.showVideoEdit = true;
      $scope.$emit('notify', {
        status : 'success',
        title : 'Preview Image Updated',
        message : 'New preview image saved.'}
      );
    });
  };

  $scope.onFileSelect = function(files) {

    $scope.video.title = $scope.video.title || stripExtension(files[0].name);
    // $scope.titlePlaceholder = '';

    var data = { title : $scope.video.title };

    // refactor
    if ($scope.video.id) {
      persistVideoData(data);
      UploadService.uploadVideo(files[0], $scope.video.id);
    } else {
      VideoService.create(data).then(function (data) {
        persistVideoData(data);
        UploadService.uploadVideo(files[0], data.id);
      });
    }
    $scope.showPreviewSelector = true;
    $scope.showUpload = false;
  };

  $scope.closePreviewSelector = function () {
    $scope.showPreviewSelector = false;
    $scope.showThumbnailSelector = false;
    $scope.showVideoEdit = true;
    if (!$scope.videoHasLoaded && $scope.hasProcessed) {
      $scope.loadVideo($scope.video.id);
    }
  };

  $scope.$on('video-upload-complete', videoUploadOnComplete);
  function videoUploadOnComplete (event) {
    // manaual ajax request doesn't return video object to extend what we have in scope
    $scope.video.status = 'processing';
    $scope.$emit('notify', {
      status : 'info',
      title : 'Video Upload Complete',
      message : 'Video has been uploaded and is now processing.'}
    );
  }

  $scope.$on('video-upload-poll', videoUploadOnPoll);
  function videoUploadOnPoll (event, data) {
    $scope.video.status = data.status;
  }

  $scope.loadVideo = function (id) {
    var url = '//' + $location.host() + ':' + $location.port() + '/embed/' + id + '/?controls=1';
    $scope.embedUrl = $sce.trustAsResourceUrl(url);
    $scope.videoHasLoaded = true;
  };

  $scope.$watch('embedUrl',
    function(newValue, oldValue) {
      if ((newValue !== '') && (oldValue !== '')) {
        $('#VideoPlayerIFrame').attr('src', $('#VideoPlayerIFrame').attr('src'));
      }
    });

  $rootScope.$on('video-save', function () {
    $scope.save();
  });

  $scope.save = function () {
    if ($scope.video.id) {
      $scope.$broadcast('video-saving', $scope.video);
      VideoService.update($scope.video.id, $scope.video).then(function (data) {
        angular.extend($scope.video, data);
        $scope.displaySection();
        $scope.$broadcast('video-saved', $scope.video);
        $scope.$emit('notify', {
          status : 'success',
          title : 'Video Updated',
          message : 'Your changes have been saved.'}
        );
      });
    } else {
      $scope.video.title = $scope.video.title || 'Untitled Video';
      VideoService.create($scope.video).then(function (data) {
        angular.extend($scope.video, data);
        var url = '/video/' + $scope.video.id + '/edit';
        $location.path(url, false);
        $scope.$emit('notify', {
          status : 'success',
          title : 'Video Create',
          message : 'New video created.'}
        );
      });
    }
  };

  $rootScope.$on('video-cancel', function () {
    $scope.cancel();
  });

  $scope.cancel = function () {
    if ($scope.video.id) {
      VideoService.get($scope.video.id).then(function (data) {
        angular.extend($scope.video, data);
        $scope.displaySection();
        $scope.$emit('notify', {
          status : 'info',
          title : 'Video Updates Discarded',
          message : 'Your changes have been discarded.'}
        );
      });
    } else {
      $location.path('/organise');
    }
  };

  $scope.$on('video-upload-success', videoUploadOnSuccess);
  function videoUploadOnSuccess (event, data) {
    var url = '/video/' + $scope.video.id + '/edit';
    $location.path(url, false);
    $scope.hasProcessed = true;
    $scope.$emit('notify', {
      status : 'success',
      title : 'Video Upload Complete',
      message : 'Video processing complete.'}
    );
  }

  $scope.$on('video-seek', videoOnSeek);
  function videoOnSeek (event, seconds) {
    if ($scope.player) {
      var state = $scope.player.getState();
      $scope.player.seek(seconds);
    }
  }

  function pollIFrame () {
    $timeout(checkIFramePlayer, 1000);
  }

  // http://support.ooyala.com/developers/documentation/api/player_v3_apis.html
  // https://www.pivotaltracker.com/story/show/75208950
  // ooyala players getDuration() function seems to occasionally
  // return duration in seconds instead of millseconds
  function durationHack (duration) {
    var isMilliseconds = (parseFloat(duration) === parseInt(duration, 10));
    console.log('getDuration(): ', duration);
    console.log('duration is milliseconds: ', isMilliseconds);
    return isMilliseconds ? duration : duration*1000;
  }

  function checkIFramePlayer () {
    var frames = document.getElementsByClassName('video-player__frame');
    if (frames.length) {
      var frame = frames[0].contentWindow || frames[0].contentDocument.parentWindow;
      if (frame.player) {
        $scope.player = frame.player;
        $scope.videoTotalTime = durationHack($scope.player.getDuration());
      }
      var OO = frame.OO;
      if (OO && OO.ready && $scope.videoTotalTime > 0) {
        OO.ready(function () {
          bindPlayerEvents(OO);
        });

      } else {
        pollIFrame();
      }

    } else {
      pollIFrame();
    }
  }

  pollIFrame();

  // http://support.ooyala.com/developers/documentation/concepts/xmp_securexdr_view_mbus.html
  // http://support.ooyala.com/developers/documentation/api/player_v3_api_events.html
  function bindPlayerEvents (OO) {
    var bus = $scope.player.mb;
    bus.subscribe(OO.EVENTS.PLAYBACK_READY, 'WonderUIModule', function () {
    });
    bus.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'WonderUIModule', function(eventName, currentTime) {
      $scope.videoCurrentTime = currentTime;
      $scope.progress = (Math.round((($scope.videoCurrentTime * 1000)/$scope.videoTotalTime) * 100 * 100))/100;
      $scope.$apply();
    });
    bus.subscribe(OO.EVENTS.SEEKED, 'WonderUIModule', function (seconds) {
      $scope.videoCurrentTime = seconds;
      $scope.player.pause();
    });
    bus.subscribe(OO.EVENTS.PAUSED, 'WonderUIModule', function () {
      $scope.$broadcast('player-paused');
    });
  }

  $rootScope.$on('display-section', function (event, section) {
    $scope.displaySection(section);
  });

  $scope.displaySection = function (section) {

    section = section || '';

    updateSectionUrl(section);

    if ($rootScope.isCollaborator) {
      displayCollaboratorSection();
    } else if (section === 'edit') {
      displayEditSection();
    } else if (section === 'comments') {
      displayComments();
    } else {
      displayReviewSection();
    }
  };

  function updateSectionUrl (section) {
    if ($scope.video && $scope.video.id) {
      var url = '/video/' + $scope.video.id + '/' + section;
      $location.path(url, false);
    }
  }

  function displayCollaboratorSection () {
    $scope.isReview = true;
    $scope.isComments = true;
    $scope.isEdit = false;
  }

  function displayEditSection () {
    $scope.isEdit = true;
    $scope.isReview = false;
    $scope.isComments = false;
  }

  function displayComments () {
    $scope.isComments = true;
    $scope.isEdit = false;
    $scope.isReview = false;
  }

  function displayReviewSection () {
    $scope.isReview = true;
    $scope.isComments = false;
    $scope.isEdit = false;
  }

  initialiseNewScope();

  function getPlayerParameters (id) {
    VideoService.getPlayerParameters(id).then(function (data) {
      $scope.playerParameters = {};
      $scope.playerParameters.rgb = data.rgb ? JSON.parse(data.rgb) : null;
      $scope.playerParameters.hideLogo = data.hideLogo === 'True' ? true : false;
    });
  }

  function verifyUser (id) {
    VideoService.isOwner(id).then(function (data) {
      $scope.isOwner = data.isOwner;
      if (!$scope.isOwner) {
        var query = $location.search();
        var token = query ? query.token : null;
        if (token) {
          validateToken(token);
        } else {
          alert('not authorised');
          $location.path('/');
        }
      }
    });
  }

  function validateToken (token) {
    return $http({
      method  : 'post',
      url     : '/api/validate_token',
      data    : { 'token' : token }
    }).success(function (data) {
      $rootScope.isCollaborator = true;
    }).error(function () {
      alert('token invalid');
      $rootScope.isCollaborator = false;
      $location.path('/');
    });
  }

  function assignStatus (status) {
    switch (status) {
      case 'ready':
      case 'published':
        $scope.hasProcessed = true;
        $scope.showVideoEdit = true;
        $scope.loadVideo($scope.video.id);
        break;
      case 'uploading':
        $scope.showUpload = true;
        break;
    }
  }

  function getVideo(id) {
    VideoService.get(id).then(function (data) {
      angular.extend($scope.video, data);
      assignStatus($scope.video.status);
      getPlayerParameters($scope.video.id);
      verifyUser($scope.video.id);
      assignCollaboratorPermissions();
    });
  }

  if ($location.path().indexOf('comments') > -1) {
    $scope.displaySection('comments');
  } else if ($location.path().indexOf('edit') > -1) {
    $scope.displaySection('edit');
  } else {
    $scope.displaySection();
  }

  if ($routeParams.id) {
    getVideo($routeParams.id);
  } else {
    $scope.displaySection('edit');
  }

  function assignCollaboratorPermissions () {
    if ($rootScope.User && $rootScope.isCollaborator) {
      var permissions = $rootScope.User.permissions;
      var l = permissions.length;
      while (l--) {
        switch (permissions[l]) {
          case 'can_comment':
            $scope.canComment = true;
          break;
          case 'can_download':
            $scope.canDownload = true;
          break;
        }
      }
    }
  }

  $scope.showComments = function () {
    if ($scope.video.id) {
      if ($rootScope.isCollaborator) {
        return $scope.canComment;
      } else {
        return $scope.isComments;
      }
    }
    return false;
  };

}
