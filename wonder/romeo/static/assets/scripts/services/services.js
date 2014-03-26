
/*  Romeo Services
 /* ================================== */

(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [] /* module dependencies */);

    app.factory('$sanitize', [function() {
        return function(input) {
            return input.replace('\n', '').replace('\t', '').replace('\r', '').replace(/^\s+/g, '');
        };
    }]);

    app.factory('$modal', ['$rootScope', '$compile', '$sanitize', '$templateCache', function($rootScope, $compile, $sanitize, $templateCache){

        var modal = {},
            el = d.createElement('div'),
            $el,
            el_bg = d.createElement('div'),
            $el_bg,
            b = d.body || d.documentElement,
            template,
            compiledTemplate,
            urlCache = {};

        el_bg.setAttribute('id', 'modal-bg');
        b.appendChild(el_bg);
        $el_bg = ng.element(el_bg);

        el.setAttribute('id', 'modal');
        b.appendChild(el);
        $el = ng.element(el);

        $el_bg.bind('click', function(event){
            modal.hide();
        });

        modal.show = function () {
            $el_bg.addClass('show');
            $el.addClass('show');
        };

        modal.hide = function () {
            $el_bg.removeClass('show');
            $el.removeClass('show');
        };

        modal.toggle = function () {
            $el_bg.toggleClass('show');
            $el.toggleClass('show');
        };

        // Load a modal template and SHOW it ( optional )
        modal.load = function ( url, show, scope, obj ) {
            template = $templateCache.get(modal.getUrl(url));
            var $scp = ng.extend(scope.$new(), {
                data: ng.extend({}, obj)
            });
            $el.html(template);
            $compile($sanitize(template))($scp);

            if ( show === true ) {
                $el_bg.addClass('show');
                $el.addClass('show');
            }
        };

        // Check if we have the URL cached
        modal.getUrl = function ( url ) {
            if ( urlCache[url] === undefined ) {
                return url;
            } else{
                return urlCache[url];
            }
        };

        // Expose our public methods
        return {
            show: modal.show,
            hide: modal.hide,
            toggle: modal.toggle,
            load: modal.load
        };

    }]);

    app.factory('$tooltip', [function(){

        var el = d.createElement('div'),
            $el,
            text = d.createElement('span'),
            $text,
            b = d.body || d.documentElement,
            $b;

        el.setAttribute('id', 'tooltip');

        el.appendChild(text);
        b.appendChild(el);

        $b = ng.element(b);
        $el = ng.element(el);

        var Tooltip = {};

        Tooltip.show = function(txt,el){
            if ( 'getBoundingClientRect' in el ) {
                text.innerHTML = txt;

                var targetpos = el.getBoundingClientRect(),
                    elpos = $el[0].getBoundingClientRect();

                $el.css({
                    top: (targetpos.top-32) + 'px',
                    left: ((targetpos.left+(targetpos.width/2)) - (elpos.width/2)) + 'px'
                });

                $el.addClass('show');
            }
        };

        Tooltip.hide = function(){
            console.log('tooltip hidden');
            $el.removeClass('show');
        };

        return {
            show: Tooltip.show,
            hide: Tooltip.hide
        };
    }]);

    app.factory('StatsService', ['DataService', function (DataService) {

        var Stats;
        var apiUrl = '/static/api/stats.json';
        var fields = [
            {
                'field': 'plays',
                'displayName': 'Total Plays',
                'description': 'Number of plays since beginning of time period',
                'visible': true,
                'color': '#7cd26f'
            },
            {
                'field': 'daily_uniq_plays',
                'displayName': 'Daily Unique Plays',
                'visible': true,
                'description': 'Number of unique plays since beginning of time period',
                'color': '#8b85d0'
            },
            {
                'field': 'monthly_uniq_plays',
                'displayName': 'Monthly Unique Plays',
                'visible': false,
                'description': 'Number of unique plays plays since beginning of time period',
                'color': '#5bccf6'
            },
            {
                'field': 'weekly_uniq_plays',
                'displayName': 'Weekly Unique Plays',
                'visible': false,
                'description': 'Number of unique plays plays since beginning of time period',
                'color': '#e25f5c'
            },
            {
                'field': 'playthrough_25',
                'displayName': 'Playthrough > 25%',
                'visible': false,
                'description': 'Number of plays to 25% since beginning of time period',
                'color': '#8b85d0'
            },
            {
                'field': 'playthrough_50',
                'displayName': 'Playthrough > 50%',
                'visible': false,
                'description': 'Number of plays to 50% since beginning of time period',
                'color': '#4becd3'
            },
            {
                'field': 'playthrough_75',
                'displayName': 'Playthrough > 75%',
                'visible': false,
                'description': 'Number of plays to 75% since beginning of time period',
                'color': '#ffec4a'
            },
            {
                'field': 'playthrough_100',
                'displayName': 'Playthrough > 100%',
                'visible': false,
                'description': 'Number of plays to 100% since beginning of time period',
                'color': '#f38bef'
            }
        ];

        Stats = {
            getOne: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request(url, ignoreCache);
            },
            getAll: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request(url, ignoreCache);
            },
            query: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request(url, ignoreCache);
            },
            getFields: function() {
                return fields;
            }
        };

        return Stats;

    }]);

    app.factory('OverviewService', ['DataService', function (DataService) {

        var Overview = {},
            api = '/static/api/stats.json';

        Overview.getOne = function (id, ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        Overview.getAll = function (ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        Overview.query = function (query, options, ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        Overview.save = function (id, overview) {
            var url = api + '';
            return DataService.save(url, id, overview);
        };

        return {
            getOne: Overview.getOne,
            getAll: Overview.getAll,
            query: Overview.query,
            save: Overview.save
        };

    }]);

    app.factory('GeographicService', ['DataService', function (DataService) {

        var GeographicService = {},
            api = '/static/api/stats.json';

        GeographicService.getOne = function (id, ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        GeographicService.getAll = function (ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        GeographicService.query = function (query, options, ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        GeographicService.save = function (id, GeographicService) {
            var url = api + '';
            return DataService.save(url, id, GeographicService);
        };

        return {
            getOne: GeographicService.getOne,
            getAll: GeographicService.getAll,
            query: GeographicService.query,
            save: GeographicService.save
        };

    }]);
    app.factory('VideoService', ['DataService', function (DataService) {

        var Video = {},
            api = '/static/api/videos.json';

        Video.getOne = function (id, ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        Video.getAll = function (ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        Video.query = function (query, options, ignoreCache) {
            var url = api + '';
            return DataService.request(url, ignoreCache);
        };

        Video.save = function (id, video) {
            var url = api + '';
            return DataService.save(url, id, video);
        };

        return {
            getOne: Video.getOne,
            getAll: Video.getAll,
            query: Video.query,
            save: Video.save
        };

    }]);

    app.factory('DataService', ['$rootScope', '$location', '$http', '$q', '$timeout', function($rootScope, $location, $http, $q, $timeout){

        var Data = {},
            cache = {};

        Data.save = function ( url, id, obj ) {
            var deferred = new $q.defer();

            $timeout( function() {
                console.log( cache[url].videos[id] = obj );
                deferred.resolve();
            },1000);

            return deferred.promise;
        };

        Data.request = function ( url, ignoreCache ){

            var deferred = new $q.defer();
            if ( ignoreCache === true || cache[url] === undefined ) {
                $http({ method: 'get', url: url }).success(function(data,status,headers,config){
                    if ( status === 200 ) {
                        cache[url] = data;
                        deferred.resolve(data);
                    } else {
                        console.log('failed');
                        deferred.reject('There was an error when retrieving the data.');
                    }
                });
            } else {
                deferred.resolve( cache[url] );
            }

            return deferred.promise;
        };

        return {
            save: Data.save,
            request: Data.request
        };

    }]);

    app.factory('FlashService', [ '$timeout', function($timeout){

        var wrapper = d.createElement('ul'),
            $wrapper,
            b = d.body || d.documentElement,
            $b;

        $b = ng.element(b);
        wrapper.setAttribute('id', 'flash-wrapper');
        $b.append(wrapper);
        $wrapper = ng.element(wrapper);

        var Flash = function( msg, type ){
            var flash = d.createElement('li'),
                text = d.createElement('span');

            flash.className = type;
            text.className = 'icon-flash-' + type;
            text.innerHTML = msg;
            flash.appendChild(text);
            $wrapper.append(flash);

            $timeout(function(){
                flash.className += ' show';
            },10);

            $timeout( function(){
                flash.className += ' fade';
            }, 3000 );

            $timeout( function(){
                wrapper.removeChild( flash );
            }, 4000 );
        };

        return {
            flash: function(msg,type){
                return new Flash(msg,type);
            }
        }

    }]);

    app.factory('DragDropService', [ 'animLoop', '$rootScope', function(animLoop, $rootScope) {

        var ghost = d.createElement('div'),
            b = d.body || d.documentElement,
            dragOrigin = {},
            dragging = false,
            dragElemId = null,
            tags = [],
            dropSuccess = false,
            debounceMouse = {},
            $ghost,
            $b,
            x,
            y;

        $b = ng.element(b);

        // Bind some listeners to the body
        $b.bind('mousemove', function(e){
            debounceMouse = e;
        });

        $b.bind('mouseup', function(e){
            if ( dropSuccess === true ) {
                dropSuccess = false;
            } else {
                dragCancel(dragElemId);
            }
        });

        // Initialise our UI element
        ghost.setAttribute('id', 'ghost');
        b.appendChild(ghost);
        $ghost = ng.element(ghost);

        var showGhost = function() {
            $ghost.addClass('show');
        };

        var hideGhost = function() {
            $ghost.removeClass('show');
        };

        var moveGhost = function() {
            $ghost.css({
                'left': x + 'px',
                'top': y + 'px'
            });
        };

        var dragStart = function(id) {
            dragElemId = id;
            $rootScope.$broadcast('dragStarted', id);
            dragOrigin = {
                x: x,
                y: y
            };
            start();
        };

        var dragCancel = function(id) {
            dragging = false;
            $rootScope.$broadcast('dragCancelled', id);
            stop();
        };

        var dragDrop = function(id) {
            dropSuccess = true;
            $rootScope.$broadcast('dragDropped', id);
            dragging = false;
            stop();
            tags = [];
        };

        var isDragging = function() {
            return dragging;
        };

        var start = function() {
            dragging = true;
            $ghost.addClass('show');
            // animLoop.add('moveghost', moveGhost);
        };

        var stop = function() {
            $ghost.removeClass('show');
            // animLoop.remove('moveghost');
            hideGhost();
        };

        var setTags = function(newTags) {
            $ghost.html('');
            tags = [];
            for ( var i = 0; i < newTags.length; i++ ) {
                tags[i] = d.createElement('div');
                tags[i].className = 'tag';
                tags[i].innerHTML = newTags[i];
                $ghost.append(tags[i]);
            }
        };

        var updateMouse = function(e){
            x = e.pageX;
            y = e.pageY;
        };

        animLoop.add('debounceMouse', function(){
            updateMouse(debounceMouse);
        });
        animLoop.add('moveghost', moveGhost);
        animLoop.start();

        return {
            dragStart: dragStart,
            dragCancel: dragCancel,
            dragDrop: dragDrop,
            isDragging: isDragging,
            setTags: setTags
        };
    }]);

    app.factory('animLoop', function(){

        var rafLast = 0;

        var requestAnimFrame = (function(){
            return  window.requestAnimationFrame     ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - rafLast));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                    rafLast = currTime + timeToCall;
                    return id;
                };
        })();

        var cancelAnimFrame = (function() {
            return  window.cancelAnimationFrame        ||
                window.cancelRequestAnimationFrame   ||
                window.webkitCancelAnimationFrame    ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelAnimationFrame     ||
                window.mozCancelRequestAnimationFrame  ||
                function(id) {
                    clearTimeout(id);
                };
        })();

        var FramePipeline = function() {
            var _t = this;
            _t.pipeline = {};
            _t.then = new Date().getTime();
            _t.now = undefined;
            _t.raf = undefined;
            _t.delta = undefined;
            _t.interval = 1000 / 60;
            _t.running = false;
        };

        FramePipeline.prototype = {
            add : function(name, fn) {
                this.pipeline[name] = fn;
            },
            remove : function(name) {
                delete this.pipeline[name];
            },
            start : function() {
                if (!this.running) {
                    this._tick();
                    this.running = true;
                }
            },
            pause : function() {
                if (this.running) {
                    cancelAnimFrame.call(window, this.raf);
                    this.running = false;
                }
            },
            setFPS : function(fps) {
                this.interval = 1000 / fps;
            },
            _tick : function tick() {
                var _t = this;
                _t.raf = requestAnimFrame.call(window, tick.bind(_t));
                _t.now = new Date().getTime();
                _t.delta = _t.now - _t.then;
                if (_t.delta > _t.interval) {
                    for (var n in _t.pipeline) {
                        _t.pipeline[n]();
                    }
                    _t.then = _t.now - (_t.delta % _t.interval);
                }
            }
        };

        var pipeline = new FramePipeline();

        Function.prototype.bind = Function.prototype.bind || function() {
            return function(context) {
                var fn = this,
                    args = Array.prototype.slice.call(arguments, 1);

                if (args.length) {
                    return function() {
                        return arguments.length ? fn.apply(context, args.concat(Array.prototype.slice.call(arguments))) : fn.apply(context, args);
                    };
                }
                return function() {
                    return arguments.length ? fn.apply(context, arguments) : fn.apply(context);
                };
            };
        };

        return pipeline;
    });


})(window,document,window.angular,'RomeoApp','services');