
/*  Romeo Filters
 /* ================================== */

(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [] /* module dependencies */);

    app.filter('slugify', function() {
        return function(input) {
            return input.toLowerCase().split('é').join('e').replace(/[^\w\s-]/g, "").replace(/[-\s]+/g, "-");
        };
    });

    app.filter('capitalize', function() {
        return function(input) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        };
    });

    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

    app.filter('collectionFilter', function() {
        return function( items, collection ) {

        };
    });

    app.filter('elipsis', function(){
        return function(str, len) {
            var newstr = str.substring(0,len);

            if ( newstr.charAt(newstr.length-1) === ' ' ) {
                newstr.substring(0,newstr.length-1);
            }

            return newstr + '...';
        };
    });

    app.filter('wholeNumber', function() {
        return function(num) {
            return parseInt(num, 10);
        };
    });

    app.filter('prettyDate', function() {
        return function(time) {
            var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
                diff = (((new Date()).getTime() - date.getTime()) / 1000),
                day_diff = Math.floor(diff / 86400);

            if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
                return;

            return day_diff === 0 && (
                    diff < 60 && "just now" ||
                    diff < 120 && "1 minute ago" ||
                    diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
                    diff < 7200 && "1 hour ago" ||
                    diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
                day_diff == 1 && "Yesterday" ||
                day_diff < 7 && day_diff + " days ago" ||
                day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
        };
    });

    app.filter('videoSearchFilter', function() {
        return function( items, filter) {

            var result = {
                    results: {},
                    length: 0
                },
                collectionmatched,
                searchmatched,
                searchterm = filter.searchtext.toLowerCase();

            ng.forEach( items, function( value, key ) {

                collectionmatched = ( filter.collection === null ) ? true : false;
                searchmatched = false;

                if ( collectionmatched === false ) {
                    ng.forEach( value.collections, function(value2, key2){
                        if ( filter.collection === value2 ) {
                            collectionmatched = true;
                        }
                    });
                }

                if ( collectionmatched === true ) {
                    if ( value.title.toLowerCase().indexOf(searchterm) !== (-1) ) {
                        searchmatched = true;
                    }
                }

                if ( collectionmatched === true && searchmatched === true) {
                    result.results[key] = value;
                    result.length++;
                }
            });
            return result;
        };
    });

    app.filter('formatDate', function () {
        return function (date, format) {
            return moment(date).format(format || 'DD/MM/YYYY');
        };
    });

})(window,document,window.angular,'RomeoApp','filters');