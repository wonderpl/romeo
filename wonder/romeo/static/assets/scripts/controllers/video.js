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
    $scope.embedUrl = '/embed/88888888/?controls=1';
    $scope.currentTime = 0;

    $scope.flags = {
      showUpload: true,
      hasProcessed: false,
      videoHasLoaded: false,
      notified: true,
      isOwner: false,
      isEdit: false,
      isReview: false,
      isComments: false
    };

    $scope.videoCurrentTime = 0;
    $scope.videoTotalTime = 0;

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
    'video.category',
    function(newValue, oldValue) {
      $scope.video.category = $scope.video.category || '';
    }
  );

  $scope.$watch(
    'video.title',
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
    'video.strapline',
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
    'video.description',
    function(newValue, oldValue) {
      if (newValue !== oldValue) {
        var val = $('<div></div>').html(newValue).text().replace(/\s/g, "");
        if (val) {
          $scope.descriptionPlaceholder = '';
        } else {
          $scope.descriptionPlaceholder = 'Additional content including but not limited to: recipes, ingredients, lyrics, stories, etc.';
        }
      }
    }
  );

  $scope.$watch(
    'video.id',
    function(newValue, oldValue) {
      if (newValue !== '' && newValue !== oldValue) {
        CommentsService.getComments(newValue).then(function (data) {
          $scope.comments = data.comment.items;
        });
      }
    }
  );

  $scope.removeCollaborator = function (id) {

    console.log('removeCollaborator()');
    console.log(id);
  };

  $scope.onPreviewImageSelect = function (files) {
    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading Image',
      message : 'Thumbnail uploading.'}
    );
    // updateImmediateCoverImage(files[0]);
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

  // $scope.onSetPreviewImage = function() {
  //   debug.log('onSetPreviewImage');
  //   getVideo($scope.video.id);
  //   $scope.showPreviewSelector = false;
  //   $scope.showThumbnailSelector = false;
  //   $scope.showVideoEdit = true;
  //   $scope.loadVideo($scope.video.id);
  // };

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
    $scope.flags.showUpload = false;
  };

  $scope.closePreviewSelector = function () {
    $scope.showPreviewSelector = false;
    $scope.showThumbnailSelector = false;
    $scope.showVideoEdit = true;
    if (!$scope.flags.videoHasLoaded && $scope.flags.hasProcessed) {
      $scope.loadVideo($scope.video.id);
    }
  };

  $scope.$on('video-upload-complete', videoUploadOnComplete);
  function videoUploadOnComplete (event) {
    // manaual ajax request doesn't return video object to extend what we have in scope
    $scope.video.status = 'processing';
  }

  $scope.$on('video-upload-success', function (event, data) {
    debug.log('videoUploadOnSuccess of video (' + $scope.video.id + ') ' + $scope.video.title);
    redirect(data, 'edit');
    $scope.flags.hasProcessed = true;
  });

  $scope.$on('video-upload-poll', function (event, data) {
    $scope.video.status = data.status;
  });

  $scope.loadVideo = function (id) {
    debug.log('loadVideo with id: ' + id);
    var url = '//' + $location.host() + ':' + $location.port() + '/embed/' + id + '/?controls=1';
    $scope.embedUrl = $sce.trustAsResourceUrl(url);
    $scope.flags.videoHasLoaded = true;
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
          shimChangesToIFrame();
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








  function shimChangesToIFrame () {

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" style="height: 0; width: 0;" id="ColourSvg"><filter id="ColourFilter" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR class="brightness red" type="linear" slope="1"/><feFuncG class="brightness green" type="linear" slope="1"/><feFuncB class="brightness blue" type="linear" slope="1"/></feComponentTransfer></filter></svg>';
    var style = '<style id="ColourStyle">.filtered { -webkit-filter : url("#ColourFilter"); -webkit-transform: translate3d(0px,0px,0px); -webkit-backface-visibility: hidden; -webkit-perspective: 1000; }</style>';

    var elements = document.getElementsByClassName('video-player__frame');
    if (!elements.length) return;

    var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
    if (!frame) return;

    var $frame = $(frame);

    var $filteredControls = $frame.find('.wonder-timer, .wonder-play, .wonder-pause, .wonder-volume, .wonder-logo, .wonder-fullscreen, .scrubber-handle');
    $filteredControls.addClass('filtered');

    var $svg = $frame.find('#ColourSvg');
    if (!$svg.length) {
      var $frameBody = $frame.find('body');
      $svg = $(svg);
      $frameBody.prepend($svg);
    }

    var $style = $frame.find('#ColourStyle');
    if (!$style.length) {
      var $frameHead = $frame.find('head');
      $style = $(style);
      $frameHead.append($style);
    }
  }

  $scope.$on('update-player-parameters', function (event, data) {
    applyPlayerParameters(data);
  });

  function applyPlayerParameters (data) {
    if (data.rgb) {
      updateColours(data.rgb);
    }
    if (typeof data.hideLogo !== 'undefined') {
      hideLogo(data.hideLogo);
    }
    if (typeof data.showBuyButton !== 'undefined') {
      showBuyButton(data.showBuyButton);
    }
    if (typeof data.showDescriptionButton !== 'undefined') {
      showDescriptionButton(data.showDescriptionButton);
    }
  }

  function getVideoIFrame () {

    var elements = document.getElementsByClassName('video-player__frame');
    if (!elements.length) return;

    var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
    if (!frame) return;

    return $(frame);
  }


  function updateColours (rgb) {

    rgb = rgb || { r : 255, g: 255, b : 255 };

    var $frame = getVideoIFrame();
    var $svg = $frame.find('#ColourSvg');
    $svg.find('.red').attr('slope', rgb.r/255);
    $svg.find('.green').attr('slope', rgb.g/255);
    $svg.find('.blue').attr('slope', rgb.b/255);
  }

  function hideLogo (hide) {

    var $frame = getVideoIFrame();
    var $logo = $frame.find('#wonder-controls');
    $logo.toggleClass('no-logo', hide);
  }

  function showBuyButton (show) {

    var $frame = getVideoIFrame();
    var $wrapper = $frame.find('#wonder-wrapper');

    if (show && $scope.video.link_title && $scope.video.link_url) {
      $wrapper.addClass('show-buy-button');
      $frame.find('#wonder-buy-button').text($scope.video.link_title);
      $frame.find('#wonder-buy-button').attr('href', $scope.video.link_url);
    } else {
      $wrapper.removeClass('show-buy-button');
    }
  }

  function showDescriptionButton (show) {

    var $frame = getVideoIFrame();
    var $wrapper = $frame.find('#wonder-wrapper');

    if (show && $scope.video.description) {
      $wrapper.addClass('show-description-button', show);
    } else {
      $wrapper.removeClass('show-description-button', show);
    }
  }


  function savePlayerParameters () {

    VideoService.setPlayerParameters($scope.video.id, {
      hideLogo              : $scope.playerParameters.hideLogo,
      rgb                   : JSON.stringify($scope.playerParameters.rgb),
      showBuyButton         : $scope.playerParameters.showBuyButton,
      showDescriptionButton : $scope.playerParameters.showDescriptionButton
    }).then(null, function () {
      $scope.$emit('notify', {
        status : 'error',
        title : 'Video Configuration Save Error',
        message : 'Your video player control changes have not been saved.'}
      );
    });
  }

  $scope.$on('video-saving', function ($event, data) {
    savePlayerParameters();
  });

  $scope.$on('video-cover-image-updated', function ($event, data) {
    updateImmediateCoverImage(data);
  });

  function updateImmediateCoverImage (data) {

    var $frame = getVideoIFrame();
    var img = $frame.find('#wonder-poster img');
    img.attr('src', data.url);
  }

  $rootScope.$on('display-section', function (event, section) {
    $scope.displaySection(section);
  });

  $scope.displaySection = function (section) {

    section = section || '';

    //updateSectionUrl(section);

    if (AuthService.isCollaborator()) {
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
    $scope.flags.isReview = true;
    $scope.flags.isComments = true;
    $scope.flags.isEdit = false;
  }

  function displayEditSection () {
    $scope.flags.isEdit = true;
    $scope.flags.isReview = false;
    $scope.flags.isComments = false;
  }

  function displayComments () {
    $scope.flags.isComments = true;
    $scope.flags.isEdit = false;
    $scope.flags.isReview = false;
  }

  function displayReviewSection () {
    debug.log('displayReviewSection()');
    $scope.flags.isReview = true;
    $scope.flags.isComments = false;
    $scope.flags.isEdit = false;
  }

  initialiseNewScope();

  function getPlayerParameters (id) {
    return VideoService.getPlayerParameters(id).then(function (data) {
      $scope.playerParameters = {};
      $scope.playerParameters.rgb = data.rgb ? angular.fromJson(data.rgb) : null;
      $scope.playerParameters.hideLogo = data.hideLogo === 'True' ? true : false;
      $scope.playerParameters.showBuyButton = data.showBuyButton === 'True' ? true : false;
      $scope.playerParameters.showDescriptionButton = data.showDescriptionButton === 'True' ? true : false;
    });
  }

  function verifyUser (id) {
    VideoService.isOwner(id).then(function (data) {
      $scope.flags.isOwner = data.isOwner;
      if (!$scope.flags.isOwner) {
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
      AuthService.setCollaborator(true);
    }).error(function () {
      alert('token invalid');
      AuthService.setCollaborator(false);
      $location.path('/');
    });
  }

  function assignStatus (status) {
    switch (status) {
      case 'ready':
      case 'published':
        $scope.flags.hasProcessed = true;
        $scope.showVideoEdit = true;
        $scope.loadVideo($scope.video.id);
        break;
      case 'uploading':
        $scope.flags.showUpload = true;
        break;
    }
  }

  function getVideo(id) {
    VideoService.get(id).then(function (data) {
      angular.extend($scope.video, data);
      assignStatus($scope.video.status);
      getPlayerParameters($scope.video.id).then(function () {
        applyPlayerParameters($scope.playerParameters);
      });
      verifyUser($scope.video.id);
      assignCollaboratorPermissions();

      debug.dir($scope.video);

      if ($rootScope.isUploadingOrProcessingTemp && (data.status === 'processing' || data.status === 'uploading')) {
        $scope.displaySection('edit');
        $scope.showPreviewSelector = true;
        $scope.flags.showUpload = false;
      }
    });
  }

  function assignCollaboratorPermissions () {
    if (AuthService.getUser() && AuthService.isCollaborator()) {
      var permissions = AuthService.getUser().permissions;
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
      if (AuthService.isCollaborator()) {
        return $scope.canComment;
      } else {
        return $scope.flags.isComments;
      }
    }
    return false;
  };

  $scope.collaborator = function () {
    return AuthService.isCollaborator();
  };
  // Call routing method on opening of controllers screen
  videoRouting();
}
