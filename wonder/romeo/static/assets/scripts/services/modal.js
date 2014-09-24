angular
  .module('RomeoApp.services')
  .factory('modal', ['$compile', '$templateCache', '$timeout', ModalService]);


function ModalService ($compile, $templateCache, $timeout) {

  'use strict';

  /*
  * Create some elements and add some classes / ID's to them
  */
  var modal = {},
      el = document.createElement('div'),
      $el,
 
      b = document.body || document.documentElement,
      template,
      compiledTemplate,
      urlCache = {};


  el.setAttribute('id', 'modal-bg');
  b.appendChild(el);
  $el = angular.element(el);
  $el.addClass('modal  modal--fullscreen');

  var container  = document.createElement('div');
  var $container = angular.element(container);
  $container.addClass('center-object');

  el.appendChild(container);

  // el.setAttribute('id', 'modal');
  // container.appendChild(el);
  // $el = angular.element(el);
  // $el.addClass('modal animated-half fadeInUp');

  $el.on('click', function (e) {
      if(e.currentTarget === e.target){
          modal.hide();
      }
  });

  /*
  * Show the modal ( assuming it has a compiled view inside it )
  */
  modal.show = function ( opts ) {
    $el.addClass('is-visible');
    $('body').addClass('disable-scroll');
  };

  modal.hide = function () {
    $el.removeClass('is-visible');
    $('body').removeClass('disable-scroll');
    $timeout(function () {
      $el.empty();
    }, 500);
  };

  /*
  * Load the modal template and show it ( optional )
  * url: the name of the template in the template cache
  * show: bool, defines whether it is show when straight after loading
  * scope: the scope of the controller that has called the modal to load is passed in
  * obj: any data that is needed in the modal is passed in
  * opts: any additional options that are required
  */
  modal.load = function (url, show, scope, obj, opts) {

      if ( opts && 'width' in opts ) {
          $el.css('width', opts.width + 'px');
      }

      template = $templateCache.get(modal.getUrl(url));
      if ( obj !== undefined ) {
          var $scp = angular.extend(scope.$new(), {
              data: angular.extend({}, obj)
          });
          compiledTemplate = $compile(template)($scp);
      } else {
          compiledTemplate = $compile(template)(scope);
      }

      // $el.html('');
      $el.append(compiledTemplate);

      if (show === true) {
         modal.show();
      }
      return $el;
  };

  /*
  * Check if the URL is cached
  */
  modal.getUrl = function (url) {
      if (urlCache[url] === undefined) {
          return url;
      } else {
          return urlCache[url];
      }
  };

  /*
  * Expose the methods to the service
  */
  return modal;

}