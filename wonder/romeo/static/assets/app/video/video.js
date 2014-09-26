//angular.module('fileUpload', [ 'angularFileUpload' ]);

angular
  .module('RomeoApp.controllers')
  .controller('VideoCtrl', ['$rootScope', '$http', '$q', '$scope', '$cookies', '$location', 'UploadService', '$routeParams', 'VideoService', '$sce', 'TagService', 'CommentsService', '$timeout', 'CollaboratorsService', 'UserService', 'AccountService', 'SecurityService', VideoCtrl]);

function VideoCtrl ($rootScope, $http, $q, $scope, $cookies, $location, UploadService, $routeParams, VideoService, $sce, TagService, CommentsService, $timeout, CollaboratorsService, UserService, AccountService, SecurityService) {

  'use strict';
  var debug = new DebugClass('VideoCtrl');

  function init() {
    $rootScope.layoutMode = $cookies.layout ? $cookies.layout : (SecurityService.isCollaborator()) ? 'column' : 'wide';

    initialiseNewScope();
    // Call routing method on opening of controllers screen
    videoRouting();

    // For add collection modal
    $scope.showOnlyPrivate = true;

    $scope.pages = [
    ];
    setNavigation();
  }

  function setNavigation() {
    if ($scope.video.id && !$scope.flags.isPublic) {
      if ($scope.flags.isOwner) {
        $scope.pages.push({
          url: '#/video/' + $scope.video.id,
          title: 'Edit',
          isActive: $scope.flags.isEdit
        });
      }
      if (! $scope.flags.showUpload && ($scope.video.status === 'published' || $scope.video.status === 'ready')) {
        $scope.pages.push({
          url: '#/video/' + $scope.video.id + '/comments',
          title: 'Collaborate',
          isActive: $scope.flags.isComments || $scope.flags.canComment
        });
      }
      if ($scope.flags.isOwner && ($scope.video.status === 'published' || $scope.video.status === 'ready')) {
        $scope.pages.push({
          url: '#/video/' + $scope.video.id + '/publish',
          title: 'Publish',
          isActive: $scope.flags.isReview
        });
      }
    }
  }

  function persistVideoData (data) {
    debug.info('persistVideoData (' + data.id + ') ' + data.title);
    angular.extend($scope.video, data);
  }

  function redirect(data, /* optional */ action) {
    var url = '/video/' + data.id;
    if (action)
      url += '/' + action;
    debug.info('redirect new url ' + url);
    $location.url(url);
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

    $scope.video = $scope.video || { tags: { items: [] } };
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
      isComments: false,
      isPublic: false
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
      if (!$scope.flags.isPublic && newValue !== '' && newValue !== oldValue) {
        CommentsService.getComments(newValue).then(function (data) {
          $scope.comments = data.comment.items;
        });
      }
    }
  );

  $scope.$watch(
    'flags',
    function (newValue, oldValue) {
      if (newValue !== oldValue) {
        setNavigation();
      }
    }, true);

  $scope.removeCollaborator = function (id) {

    console.log('removeCollaborator()');
    console.log(id);
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
    $scope.video.status = data.status;
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
      if (angular.isArray($scope.video.search_keywords)) {
        $scope.video.search_keywords = $scope.video.search_keywords.join(',');
      }
      if ($scope.video.hosted_url) {
        if (! $scope.video.hosted_url.match(/^http[s]?:\/\/.+/i)) {
          if ($scope.video.hosted_url.match(/^http[s]?:\/\/$/i)) {
            $scope.video.hosted_url = '';
          }
          else {
            $scope.video.hosted_url = 'http://' + $scope.video.hosted_url;
          }
        }
      }
      VideoService.update($scope.video.id, $scope.video).then(function (data) {
        saveCallback(data);

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
        saveCallback(data);

        $scope.$emit('notify', {
          status : 'success',
          title : 'Video Created',
          message : 'New video created.'}
        );
      });
    }
  };

  function saveCallback(res) {
    res = res.data || res;
    debug.log('saving video succeeded with id ' + res.id);

    removeTags(res, res.tags.items).then(function () {
      addTags(res, res.tags.items).then(function () {
        console.log('Save complete');
        res.tags = $scope.video.tags;
        persistVideoData(res);
        $scope.$broadcast('video-saved', $scope.video);
      });
    });
  }

  function removeTags(video, tags) {
    var queue = new $q.defer();
    var queueCounter = 0;
    var loopFunction = function () {
      --queueCounter;
      if (0 <= queueCounter)
        queue.resolve();
    };
    if ($scope.video && $scope.video.tags && $scope.video.tags.items && $scope.video.tags.items.length) {
      var items = $scope.video.tags.items;
      for (var i = 0; i < tags.length; ++i) {
        if (! contains(items, tags[i])) {
          ++queueCounter;
          VideoService.removeFromCollection(video.id, tags[i].id).then(loopFunction);
        }
      }
    }
    if (0 <= queueCounter) {
      queue.resolve();
    }
    return queue.promise;
  }

  function addTags(video, tags) {
    var queue = new $q.defer();
    var queueCounter = 0;
    var items = [];
    var loopFunction = function () {
      --queueCounter;
      if (0 <= queueCounter)
        queue.resolve();
    };
    if ($scope.video && $scope.video.tags && $scope.video.tags.items) {
      items = $scope.video.tags.items;
    }
    for (var i = 0; i < items.length; ++i) {
      if (! contains(tags, items[i])) {
        tags.push(items[i]);
        ++queueCounter;
        VideoService.addToCollection(video.id, items[i].id).then(loopFunction);
      }
    }
    if (0 <= queueCounter) {
      queue.resolve();
    }
    return queue.promise;
  }

  function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].id === obj.id) {
            return true;
        }
    }
    return false;
  }

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
        persistVideoData(data);
        // $scope.displaySection();
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

  $rootScope.$on('display-section', function (event, section) {
    $scope.displaySection(section);
  });

  $scope.displaySection = function (section) {

    section = section || '';

    //updateSectionUrl(section);

    if (SecurityService.isCollaborator()) {
      displayCollaboratorSection();
    }  else if (section === 'comments') {
      displayComments();
    } else {
      displayEditSection();
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


  function getPlayerParameters (id) {
    return VideoService.getPlayerParameters(id).then(function (data) {
      $scope.playerParameters = {};
      $scope.playerParameters.rgb = data.rgb ? angular.fromJson(data.rgb) : null;
      $scope.playerParameters.hideLogo = data.hideLogo === 'True' ? true : false;
      $scope.playerParameters.showBuyButton = data.showBuyButton === 'True' ? true : false;
      $scope.playerParameters.showDescriptionButton = data.showDescriptionButton === 'True' ? true : false;
    });
  }

  function assignStatus (status) {
    switch (status) {
      case 'ready':
      case 'published':
        $scope.flags.hasProcessed = true;
        $scope.showVideoEdit = true;
        $scope.loadVideo($scope.video.id);
        $scope.flags.showUpload = false;
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
      getPlayerParameters($scope.video.id);

      if ($scope.video.account.id === AccountService.getAccount().id) {
        $scope.flags.isOwner = true;
      } else {
        AccountService.getPublicAccount($scope.video.account.id).then(function (res) {
          res = res.data || res;
          $scope.video.account = res;
        });
        displayCollaboratorSection();
        assignCollaboratorPermissions();
      }

      debug.dir($scope.video);

      if ($rootScope.isUploadingOrProcessingTemp && (data.status === 'processing' || data.status === 'uploading')) {
        $scope.displaySection('edit');
        $scope.showPreviewSelector = true;
        $scope.flags.showUpload = false;
      }
    }, function (res) {
      if (res.status == '403') {
        VideoService.getPublicVideo(id).then(function (res) {
          $scope.video = res.data;
          // Fetch collaborators for this video
          $http.get(res.data.collaborators.href).then(function (res2) {
            var arr = angular.fromJson(res2.data).collaborator.items;
            console.log('Public video response: ', arr);
            for (var i = 0; i < arr.length; ++i) {
              if (arr[i].owner) {
                $scope.owner = arr[i];
                arr.splice(i, 1);
                break;
              }
            }
            $scope.collaborators = arr;
            console.log('Public video owner: ', $scope.owner);
            console.log('Public video collaborators: ', $scope.collaborators);
          });

          AccountService.getPublicAccount($scope.video.account.id).then(function (res) {
            res = res.data || res;
            $scope.video.account = res;
          });

          // Set flags
          $scope.flags.showUpload = false;
          $scope.flags.hasProcessed = false;
          $scope.flags.videoHasLoaded = false;
          $scope.flags.notified = true;
          $scope.flags.isOwner = false;
          $scope.flags.isEdit = false;
          $scope.flags.isReview = false;
          $scope.flags.isComments = false;
          $scope.flags.isPublic = true;

          $scope.loadVideo($scope.video.id);
        });
      }
      else
        console.error('Error fetching video: ', res);
    });
  }

  // How is this supposed to work?
  function assignCollaboratorPermissions () {
    CollaboratorsService.getCollaborators($scope.video.id).then(function (res) {
      res = res.data || res;
      console.log('assignCollaboratorPermissions: ', res.collaborator);
      if (!res.collaborator || ! res.collaborator.items)
        return;
      angular.forEach(res.collaborator.items, function (val, key) {
        if (val.user && val.user.id === UserService.getUser().id) {
          console.log('assignCollaboratorPermissions found user:  ', val.user);
          $scope.permissions = val.permissions;
          var l = val.permissions.length;
          while (l--) {
            switch (val.permissions[l]) {
              case 'can_comment':
                $scope.flags.canComment = true;
              break;
              case 'can_download':
                $scope.flags.canDownload = true;
              break;
            }
          }
          console.log('assignCollaboratorPermissions scope.flags:  ', $scope.flags);
        }
      });
    });
  }

  $scope.showComments = function () {
    if ($scope.video.id) {
      if (!$scope.flags.isOwner) {
        return $scope.flags.canComment;
      } else {
        return $scope.flags.isComments;
      }
    }
    return false;
  };

  $scope.collaborator = function () {
    return SecurityService.isCollaborator();
  };
  init();
}
