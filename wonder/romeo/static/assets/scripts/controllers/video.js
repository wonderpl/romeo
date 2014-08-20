//angular.module('fileUpload', [ 'angularFileUpload' ]);

angular
  .module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$http', '$scope', '$location', 'UploadService', '$routeParams', 'VideoService', '$sce', 'TagService', 'CommentsService', '$timeout', 'AuthService', VideoCtrl]);

function VideoCtrl ($rootScope, $http, $scope, $location, UploadService, $routeParams, VideoService, $sce, TagService, CommentsService, $timeout, AuthService) {

  'use strict';
  var debug = new DebugClass('VideoCtrl');

  function persistVideoData (data) {
    debug.info('persistVideoData (' + data.id + ') ' + data.title);
    angular.extend($scope.video, data);
  }

  function redirect(data, /* optional */ action) {
    var url = '/video/' + data.id;
    if (action)
      url += '/' + action;
    debug.info('redirect new url ' + url);
    $location.path(url, true);
  }

  function persistDataAndRedirect(data, /* optional */ action) {
    persistVideoData(data);
    redirect(data, action);
  }

  function videoRouting() {
    debug.dir($routeParams);
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
      if ($rootScope.isUploadingOrProcessingTemp && $rootScope.uploadingVideoId) {
        getVideo($rootScope.uploadingVideoId);
      }
      $scope.displaySection('edit');
    }
  }

  function initialiseNewScope () {

    $scope.video = $scope.video || {};
    $scope.titlePlaceholder = 'Untitled Video';
    $scope.straplinePlaceholder = 'Subtitle';
    $scope.descriptionPlaceholder = 'Additional content including but not limited to: recipes, ingredients, lyrics, stories, etc.';
    $scope.showUpload = true;
    $scope.hasProcessed = false;
    $scope.videoHasLoaded = false;
    $scope.embedUrl = '/embed/88888888/?controls=1';
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
    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading Image',
      message : 'Thumbnail uploading.'}
    );
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
    }, function () {
      $scope.$emit('notify', {
        status : 'error',
        title : 'Preview Image Update Error',
        message : 'Preview image not saved.'}
      );
    });
  };

  $scope.onSetPreviewImage = function() {
    debug.log('onSetPreviewImage');
    getVideo($scope.video.id);
    $scope.showPreviewSelector = false;
    $scope.showThumbnailSelector = false;
    $scope.showVideoEdit = true;
    $scope.loadVideo($scope.video.id);
  };

  $scope.onFileSelect = function(files) {
    $scope.video.title = $scope.video.title || stripExtension(files[0].name);
    var data = { title : $scope.video.title };

    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading Video',
      message : 'Upload started for video ' + $scope.video.title + '.'}
    );

    //@TODO refactor
    if ($scope.video.id) {
      persistVideoData(data);
      UploadService.uploadVideo(files[0], $scope.video.id);
    } else {
      VideoService.create(data).then(function (data) {
        persistVideoData(data);
        UploadService.uploadVideo(files[0], data.id);
        $rootScope.uploadingVideoId = data.id;
      });
    }
    $rootScope.isUploadingOrProcessingTemp = true;
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

  $scope.$on('video-upload-success', function (event, data) {
    debug.log('videoUploadOnSuccess of video (' + $scope.video.id + ') ' + $scope.video.title);
    redirect(data, 'edit');
    $scope.hasProcessed = true;
    $scope.$emit('notify', {
      status : 'info',
      title : 'Your Video is Ready',
      message : 'Video processing complete.'}
    );
  });

  $scope.$on('video-upload-poll', function (event, data) {
    $scope.video.status = data.status;
  });

  $scope.loadVideo = function (id) {
    debug.log('loadVideo with id: ' + id);
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

  $scope.$on('video-save', function (event) {
    event.stopPropagation = true;
    $scope.save();
  });

  $scope.save = function () {
    if ($scope.video.id) {
      debug.log('save video with id ' + $scope.video.id);
      $scope.$broadcast('video-saving', $scope.video);
      VideoService.update($scope.video.id, $scope.video).then(function (data) {
        debug.log('saving video succeeded with id ' + data.id);
        persistDataAndRedirect(data);
        $scope.displaySection();
        if ($scope.video.status === 'processing' || $scope.video.status === 'uploading') {
          $scope.displaySection('edit');
        } else {
          $scope.displaySection();
        }
        $scope.$broadcast('video-saved', $scope.video);
        $scope.$emit('notify', {
          status : 'success',
          title : 'Video Details Updated',
          message : 'Your changes have been saved.'}
        );
      });
    } else if (!$scope.video.title || $scope.video.title.trim() === '') {
      $scope.$emit('notify', {
        status : 'error',
        title : 'Video Not Saved',
        message : 'Title is a required field.'}
      );
    } else {
      debug.log('save - create video with title ' + $scope.video.title);
      VideoService.create($scope.video).then(function (data) {
        debug.log('save - creating video succeeded with id ' + data.id + ' and title ' + data.title);
        persistDataAndRedirect(data, 'edit');
        $scope.$emit('notify', {
          status : 'success',
          title : 'Video Created',
          message : 'New video created.'}
        );
      });
    }
  };

  $scope.$on('video-cancel', function (event) {
    event.stopPropagation = true;
    cancel();
  });

  $scope.bottomCancel = function() {
    cancel();
  };

  $scope.$on('show-hide-collection', function() {
    $scope.addCollectionShow = !$scope.addCollectionShow;
    debug.info('Show hide collection, state: ' + $scope.addCollectionShow);
  });

  function cancel() {
    if ($scope.video.id) {
      debug.log('Cancelled editing of video (' + $scope.video.id + ') ' + $scope.video.title);
      VideoService.get($scope.video.id).then(function (data) {
        persistDataAndRedirect(data);
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
  }


  $scope.$on('video-seek', videoOnSeek);
  function videoOnSeek (event, seconds) {
    if ($scope.player) {
      var state = $scope.player.getState();
      debug.log('state: ', state);
      debug.log('seconds: ', seconds);
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
    debug.log('getDuration(): ', duration);
    debug.log('duration is milliseconds: ', isMilliseconds);
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
      $scope.player.pause();
    });
    bus.subscribe(OO.EVENTS.PAUSED, 'WonderUIModule', function () {
      $scope.$broadcast('player-paused');
    });
    bus.subscribe(OO.EVENTS.ERROR, 'WonderUIModule', function (code) {
      debug.log('player error ', code);
      $scope.$emit('notify', {
        status : 'error',
        title : 'Video Player Error',
        message : 'Video player is experiencing technical issues.'}
      );
      $scope.$broadcast('player-error');
    });
  }

  $rootScope.$on('display-section', function (event, section) {
    $scope.displaySection(section);
  });

  $scope.displaySection = function (section) {

    section = section || '';

    //updateSectionUrl(section);

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
      redirect($scope.video, section);
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
    debug.log('displayReviewSection()');
    $scope.isReview = true;
    $scope.isComments = false;
    $scope.isEdit = false;
  }

  initialiseNewScope();

  function getPlayerParameters (id) {
    VideoService.getPlayerParameters(id).then(function (data) {
      $scope.playerParameters = {};
      $scope.playerParameters.rgb = data.rgb ? angular.fromJson(data.rgb) : null;
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

      debug.dir($scope.video);

      if ($rootScope.isUploadingOrProcessingTemp && (data.status === 'processing' || data.status === 'uploading')) {
        $scope.displaySection('edit');
        $scope.showPreviewSelector = true;
        $scope.showUpload = false;
      }
    });
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
  // Call routing method on opening of controllers screen 
  videoRouting();
}
