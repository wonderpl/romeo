angular
  .module('RomeoApp.services')
  .factory('modal', ['$rootScope', '$compile', '$templateCache', '$timeout', ModalService]);


function ModalService ($rootScope, $compile, $templateCache, $timeout) {
  'use strict';

  // Create some elements and add some classes / ID's to them
  var modal = {},
      $el,
      b = document.body || document.documentElement,
      template,
      compiledTemplate,
      urlCache = {},
      modalShowing = false,
      modalClass = '',
      modalIsSmall = false;

  function createModalElements(scope, opts) {
    scope = scope || $rootScope.$new();
    opts = opts || {};
    if (typeof scope.close !== 'function') {
      scope.close = modal.hide;
    }
    var el = document.createElement('div');
    if (modalShowing) {
      $el.remove();
      modalShowing = false;
    }

    el.setAttribute('id', 'modal-bg');
    if (opts.element && document.getElementById(opts.element))
      document.getElementById(opts.element).appendChild(el);
    else
      b.appendChild(el);
    $el = angular.element(el);
    $el.addClass(opts.class || 'modal  modal--fullscreen');
    if (opts.fullScreen) {
      $('body').addClass('disable-scroll');
    }

    // Close button
    var $closeBtn  = $compile('<a ng-click="close()" class="modal-close"><i class="icon  icon--large  icon--cross"></i></a>')(scope);

    var container  = document.createElement('div');
    var $container = angular.element(container);
    $container.addClass('center-object');

    $el.append($closeBtn);
    el.appendChild(container);
  }

  // Show the modal ( assuming it has a compiled view inside it )
  modal.show = function ( opts ) {
    modalShowing = true;
    $timeout(function () { $el.addClass('is-visible'); }, 150);

  };

  modal.hide = function () {
    $el.removeClass('is-visible');
    $('body').removeClass('disable-scroll');
    $timeout(function () {
      $el.remove();
      modalShowing = false;
    }, 300);
  };


  // Load the modal template and show it ( optional )
  // url: the name of the template in the template cache
  // show: bool, defines whether it is show when straight after loading
  // scope: the scope of the controller that has called the modal to load is passed in
  // obj: any data that is needed in the modal is passed in
  // opts: any additional options that are required
  modal.load = function (url, show, scope, obj, opts) {
    opts = opts || {};
    opts.fullScreen = !(opts && opts.small);
    createModalElements(scope, opts);
    if ( opts && 'width' in opts ) {
        $el.css('width', opts.width + 'px');
    }

    template = $templateCache.get(modal.getUrl(url));
    if ( typeof obj !== 'undefined' ) {
        var $scp = angular.extend(scope.$new(), {
            data: angular.extend({}, obj)
        });
        compiledTemplate = $compile(template)($scp);
    } else {
        compiledTemplate = $compile(template)(scope);
    }

    $el.append(compiledTemplate);

    if (show === true) {
       modal.show();
    }
    return $el;
  };

  // Load the modal directive and show it
  // name: the name of the directive to load
  // scope: the scope of the controller that has called the modal to load is passed in
  // opts: any additional options that are required
  modal.loadDirective = function (name, scope, opts) {
    opts = opts || {};
    opts.fullScreen = !(opts && opts.small);
    createModalElements(scope, opts);

    $el.find('.center-object').append($compile('<' + name + '></' + name + '>')(scope));
    modal.show();
  };

  // Check if the URL is cached
  modal.getUrl = function (url) {
      if (urlCache[url] === undefined) {
          return url;
      } else {
          return urlCache[url];
      }
  };

  // Expose the methods to the service
  return modal;

}