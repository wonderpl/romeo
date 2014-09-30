// slider
new IdealImageSlider.Slider('#slider');

// smoothscroll
window.smoothScrollTo = (function () {
  var timer, start, factor;

  return function (target, duration) {
    var offset = window.pageYOffset,
        delta  = target - window.pageYOffset; // Y-offset difference
    duration = duration || 500;              // default 0.5 milli sec animation
    start = Date.now();                       // get start time
    factor = 0;

    if( timer ) {
      clearInterval(timer); // stop any running animations
    }

    function step() {
      var y;
      factor = (Date.now() - start) / duration; // get interpolation factor
      if( factor >= 1 ) {
        clearInterval(timer); // stop animation
        factor = 1;           // clip to max 1.0
      }
      y = factor * delta + offset;
      window.scrollBy(0, y - window.pageYOffset);
    }

    timer = setInterval(step, 10);
    return timer;
  };
}());

(function () {
  'use strict';

  function toogleClass(elem, className) {
    var tempClassName = ' ' + elem.className + ' ';
    if (tempClassName.indexOf(' ' + className + ' ') !== -1)
      elem.className.replace(className, ''); // Set??
    else
      elem.className += ' ' + className;
  }

  document.getElementById('js-app-tray-trigger').addEventListener('click', function () {
    var elems = document.getElementsByClass('app-tray');
    for (var i = 0; i < elems.length; ++i) {
      toggleClass(elems[1], 'is-hidden');
    }
  });
  document.getElementById('js-app-tray-trigger').addEventListener('click', function () {
    toggleClass(document.getElementById('page-body'), 'tray-open');
  });
})();
