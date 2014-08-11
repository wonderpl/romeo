angular
  .module('RomeoApp.services')
  .factory('$modal', ['$rootScope', '$compile', '$sanitize', '$templateCache', '$timeout', ModalService]);


function ModalService ($rootScope, $compile, $sanitize, $templateCache, $timeout) {

  /*
  * Create some elements and add some classes / ID's to them
  */
  var modal = {},
      el = document.createElement('div'),
      $el,
      el_bg = document.createElement('div'),
      $el_bg,
      b = document.body || document.documentElement,
      template,
      compiledTemplate,
      urlCache = {};


  el_bg.setAttribute('id', 'modal-bg');
  b.appendChild(el_bg);
  $el_bg = angular.element(el_bg);
  $el_bg.addClass('modal-bg');

  var container  = document.createElement('div');
  var $container = angular.element(container);
  $container.addClass('center-object');

  el_bg.appendChild(container);

  el.setAttribute('id', 'modal');
  container.appendChild(el);
  $el = angular.element(el);
  $el.addClass('modal animation animation--flippable');

  $container.on('click', function (e) {
      if(e.currentTarget === e.target){
          modal.hide();
      }
  });

  /*
  * Show the modal ( assuming it has a compiled view inside it )
  */
  modal.show = function ( opts ) {
      $el_bg.addClass('show');
      $el.addClass('show');
  };

  modal.hide = function () {

    $el.addClass('animate--flipOutX');
    $el.removeClass('animate--flipInX');

    $timeout(function() {

      $el_bg.removeClass('show');

      
    },750);

    $timeout(function() {
      $el.removeClass('animate--flipOutX');
    },1000);      
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
          compiledTemplate = $compile($sanitize(template))($scp);
      } else {
          compiledTemplate = $compile($sanitize(template))(scope);
      }

      $el.html('');
      $el.append(compiledTemplate);

      if (show === true) {
          $el_bg.addClass('show');
          $el.addClass('animate--flipInX');
      }
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