// slider
new IdealImageSlider.Slider('#slider');

// smoothscroll
window.smoothScrollTo = (function () {
  'use strict';
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
  var timer;

  function toggleClass(elem, className) {
    var tempClassName = ' ' + elem.className + ' ';
    if (tempClassName.indexOf(' ' + className + ' ') !== -1)
      elem.className = tempClassName.replace(' ' + className + ' ', ' ');
    else
      elem.className += ' ' + className;
  }

  document.getElementById('js-app-tray-trigger').addEventListener('click', function () {
    var elems = document.getElementsByClassName('app-tray');
    for (var i = 0; i < elems.length; ++i) {
      toggleClass(elems[i], 'is-hidden');
    }
    toggleClass(document.getElementById('page-body'), 'tray-open');
  });
  document.getElementById('invite-form').addEventListener('submit', function (e) {
    if (e.preventDefault) e.preventDefault();
    document.getElementById('invite-email').disabled = true;
    toggleClass(document.getElementById('invite-submit'), 'btn--disabled');
    registerInterest();
    return false;
  });

  function registerInterest() {
    // var name = document.getElementById('invite-name').value;
    var email = document.getElementById('invite-email').value;
    // var msg = document.getElementById('invite-message').value;
    ajaxPost('/api/invite_request', {
      'email': email,
      // 'name': name,
      // 'message': msg
    }, function () {
      notify('Success', 'Invitation sent');
      clearForm();
    }, function (res) {
      console.error('Failed ajax post: ', res);
      notify('Failed', 'Invalid email address.');
      clearForm();
    });
  }

  function clearForm() {
    // document.getElementById('invite-name').value = '';
    document.getElementById('invite-email').value = '';
    // document.getElementById('invite-message').value = '';
  }

  function notify(state, msg) {
    if (! timer) {
      document.getElementById('invite-form').insertAdjacentHTML('afterend', '<div id="notification" class=""></div>');
    } else {
      clearTimeout(timer);
    }
    console.log('Notify', state, msg);
    var elem = document.getElementById('notification');
    elem.innerHTML = '<div class="flag  flag--rev"><div class="flag__body"><b>' + state + '</b><p>' + msg + '</p></div></div>';
    elem.className = 'notice  animated-half  bounceIn notice--active ' + (state == 'Success' ? '  notice--succes' : '  notice--error');

    timer = setTimeout(function () {
      console.log('clear notification');
      elem.parentElement.removeChild(elem);
    }, 3500);
  }

  function ajaxPost(url, data, success, failure) {
    var xhr;

    success = success || function () {};
    failure = failure || function () {};

    if (typeof XMLHttpRequest !== 'undefined')
      xhr = new XMLHttpRequest();
    else {
      var versions = ["MSXML2.XmlHttp.5.0",
                      "MSXML2.XmlHttp.4.0",
                      "MSXML2.XmlHttp.3.0",
                      "MSXML2.XmlHttp.2.0",
                      "Microsoft.XmlHttp"];

      for(var i = 0, len = versions.length; i < len; i++) {
        try {
          xhr = new ActiveXObject(versions[i]);
          break;
        }
        catch(e){}
      } // end for
    }

    xhr.onreadystatechange = ensureReadiness;

    function ensureReadiness() {
      if(xhr.readyState < 4) {
        return;
      }


      // all is well
      if (xhr.readyState === 4) {
        if (xhr.status !== 200 && xhr.status !== 204)
          failure(xhr);
        else
          success(xhr);
      }
    }

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data ? JSON.stringify(data) : '');
  }
})();


