
function DebugClass(name) {
    'use strict';
    var debugName = name;
    var show = false;

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return "";
    }

    if (typeof console !== 'undefined') {
        var cookie = getCookie('debug');
        if (cookie && (cookie == 'all' || cookie.indexOf(debugName) != -1)) {
            show = true;
        }
    }

    return {
        log: function(msg) {
            if (show)
                console.log(name + ': ' + msg);
        },
        info: function(msg) {
            if (show)
                console.info(name + ': ' + msg);
        },
        warn: function(msg) {
            if (show)
                console.warn(name + ': ' + msg);
        },
        error: function(msg) {
            if (show)
                console.error(name + ': ' + msg);
        },
        trace: function(obj) {
            if (show)
                console.trace(obj);
        },
        dir: function(obj) {
            if (show) {
                console.group(name);
                console.dir(obj);
                console.groupEnd();
            }
        },
        group: function(msg) {
            if (show)
                console.group(name + ': ' + msg);
        },
        groupEnd: function() {
            if (show)console.groupEnd();
        }
    };
}