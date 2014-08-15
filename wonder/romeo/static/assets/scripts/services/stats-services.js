/*  Stats services
/* ================================== */

(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [] /* module dependencies */);

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
                return DataService.request({url: url});
            },
            getAll: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request({url: url});
            },
            query: function (id, ignoreCache) {
                var url = apiUrl + '';
                return DataService.request({url: url});
            },
            getFields: function () {
                return fields;
            }
        };

        return Stats;

    }]);

    app.factory('AnalyticsFields', function () {
        return [
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
    });

    app.factory('OverviewService', ['DataService', function (DataService) {

        return {
            get: function (videoId, fromDate, toDate) {

                var url = _.template('/static/api/stats.json', {id: videoId });
                var params = { start: fromDate, end: toDate };
                return DataService.request({
                    url: url,
                    params: params
                }).then(function (data) {
                    return data.overview;
                });

            }
        };

    }]);

    app.factory('PerformanceService', ['DataService', function (DataService) {

        return {
            get: function (videoId, fromDate, toDate) {

                var url = _.template('/api/video/${ id }/analytics/performance', {id: videoId });
                var formatdate = function (date) {
                    return moment(date).format('YYYY-MM-DD');
                };

//                var url = _.template('/static/api/performance.json', {id: videoId });
                var params = {start: formatdate(fromDate), end: formatdate(toDate), breakdown_by: 'day' };
                return DataService.request({
                    url: url,
                    params: params
                }).then(function (data) {
                    return data.metrics;
                });

            }
        };

    }]);

    app.factory('GeographicService', ['DataService', function (DataService) {
        return {
            get: function (videoId, selectedRegion, fromDate, toDate) {
                // var url = _.template('/api/video/${ id }/analytics/performance', {id: videoId });
                var url = _.template('/api/video/${ id }/analytics/country${ selectedRegionId }', {id: videoId, selectedRegionId: selectedRegion.name.match(/world/i) ? '' : '/' + selectedRegion.regionId });
                var formatdate = function (date) {
                    return moment(date).format('YYYY-MM-DD');
                };

                var params = {start: formatdate(fromDate), end: formatdate(toDate), breakdown_by: 'day' };
                return DataService.request({url: url, params: params}).then(function (data) {
                    return data.metrics;
                });
            },
            getMap: function (selectedRegion) {
                var url = _.template('/static/api/maps/${ selectedRegion }.json', {selectedRegion: selectedRegion.name.toLowerCase() });
                return DataService.request({url: url});
            }
        };
    }]);

    app.factory('EngagementService', ['DataService', function (DataService) {
        return {
            get: function (videoId, fromDate, toDate) {

                var url = _.template('/api/video/${ id }/analytics/engagement', {id: videoId });
                var formatdate = function (date) {
                    return moment(date).format('YYYY-MM-DD');
                };

                var params = {start: formatdate(fromDate), end: formatdate(toDate), breakdown_by: 'day' };
                return DataService.request({url: url, params: params}).then(function (data) {
                    return data.engagement.results[0].metrics;
                });

            }
        };
    }]);

})(window, document, window.angular, 'RomeoApp', 'stats-services');
