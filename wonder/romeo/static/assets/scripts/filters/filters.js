
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

        }
    });

    app.filter('wholeNumber', function() {
        return function(num) {
            return parseInt(num, 10);
        };
    });

    app.filter('videoSearchFilter', function() {
        return function( items, filter) {

            // if ( search === "" ) {
            //     return items;
            // }

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

                // ng.forEach( value, function( value2, key2 ) {

                //     if ( filter.collection === null ) {
                //         collectionmatched = true;
                //     } else if ( typeof value2 === "object" ) {
                //         ng.forEach( value2, function( value3, key3 ){
                //             if ( filter.collection === value3.id ) {
                //                 collectionmatched = true;
                //             }
                //         });
                //     } 

                //     if ( collectionmatched === true ) {
                //         console.log( 'collectionmatched === true' );
                //         if ( typeof value2 === "string" ) {
                //             if ( value2.toLowerCase().indexOf(searchterm) !== (-1) ) {
                //                 searchmatched = true;
                //             }    
                //         }    
                //     }

                // });

                if ( collectionmatched === true && searchmatched === true) {
                    result.results[key] = value;
                    result.length++;
                }
            });
            return result;
        }
    });

    app.filter('formatDate', function () {
        return function (date, format) {
            return moment(date).format(format || 'DD/MM/YYYY');
        };
    });

})(window,document,window.angular,'RomeoApp','filters');