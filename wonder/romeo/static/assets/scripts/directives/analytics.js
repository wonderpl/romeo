/*  Romeo Directives
 /* ================================== */

(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [ns + '.services'] /* module dependencies */);

    // app.directive('directiveTemplate', ['$rootScope', '$timeout', function($rootScope, $timeout){
    //     return {
    //         restrict: 'E',
    //         link: function(scope, elem, attrs) {
    //         }
    //     };
    // }]);

    app.directive('plAnalyticsOverview', ['$rootScope', '$timeout', 'OverviewService', function ($rootScope, $timeout, OverviewService) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-overview.html',
            scope: true,
            controller: function ($scope) {
                OverviewService.getOne($scope.video.videoID).then(function (data) {
                    $scope.data.overview = data.overview;
                });
            }
        };
    }]);

    app.directive('plAnalyticsOverviewWidget', ['$rootScope', '$timeout', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/static/views/directives/analytics-widget.html',
            scope: {
                data: '='
            },
            controller: function ($scope) {
                $scope.$watch('data', function (data) {
                    if (_.isArray(data)) {
                        $scope.viewModel = {
                            primary: $scope.data[0],
                            secondary: $scope.data.slice(1)
                        };
                    }
                });

            }
        };
    }]);

    app.directive('plAnalyticsWidgetStatistic', ['$rootScope', '$timeout', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/static/views/directives/analytics-widget-statistic.html',
            scope: {
                datum: '='
            }
        };
    }]);

    app.directive('plAnalyticsPerformanceChart', ['$rootScope', '$timeout', 'StatsService', function ($rootScope, $timeout, StatsService) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-performance.html',
            scope: true,
            controller: function ($scope) {

                var getChartData = function (data) {

                    var visibleFields;
                    var series;

                    visibleFields = _($scope.fields).where({visible: true}).value();

                    // TODO: Optimise
                    series = _.map(visibleFields, function (field) {
                        return {
                            // Series Key
                            key: field.displayName,

                            // Series Values
                            values: _.map(data, function (datum) {
                                return {
                                    name: field.field,
                                    date: datum.dateObj,
                                    value: datum[field.field]
                                };
                            }),

                            // Series Color
                            color: field.color
                        };
                    });

                    return series;
                };

                // Get the data we need
                StatsService.getOne($scope.video.videoID).then(function (data) {

                    _(data.performance).forEach(function (datum) {
                        datum.dateObj = moment(datum.date, 'YYYY-MM-DDW').toDate();
                    });

                    $scope.setResults('date', 'Date', null, null, data.performance);

                    $scope.chartData = getChartData(data.performance);

                    nv.addGraph(function () {
                        var chartHeight = 350;
                        var chartWidth = 960;

                        var xTickValues = d3.time.scale()
                            .domain(_.pluck($scope.chartData[0].values, 'date'))
                            .ticks(d3.time.day, $scope.chartData);

                        var yTickValues = d3.scale.linear()
                            .domain([0, d3.max(_($scope.chartData).pluck('values').flatten().pluck('value').value())])
                            .nice()
                            .ticks();

                        var chart = nv.models.lineChart()
                            .x(function (d) {
                                return d.date;
                            })
                            .y(function (d) {
                                return d.value;
                            })
                            .height(chartHeight)
                            .width(chartWidth)
                            .showLegend(false)
                            .margin({top: 50, right: 50, bottom: 50, left: 50})
                            .useInteractiveGuideline(true);

                        chart.xAxis
                            .tickValues(xTickValues)
                            .tickFormat(function (d) {
                                return d3.time.format('%x')(new Date(d));
                            });

                        chart.forceY([0, yTickValues.slice(-1)[0]]);

                        d3.select('#performance-chart')
                            .attr('height', chartHeight)
                            .attr('width', chartWidth)
                            .datum($scope.chartData)
                            .transition().duration(500)
                            .call(chart);

                        nv.utils.windowResize(chart.update);

                        $scope.$watch('fields', function () {
                            $scope.chartData = getChartData(data.performance);

                            d3.select('#performance-chart')
                                .attr('height', chartHeight)
                                .attr('width', chartWidth)
                                .datum($scope.chartData)
                                .transition().duration(500)
                                .call(chart);

                        }, true);

                        return chart;
                    });

                });

            }
        };
    }]);

    app.directive('plAnalyticsGeographicMap', ['$rootScope', '$timeout', '$http', 'GeographicService', function ($rootScope, $timeout, $http, GeographicService) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-geographic.html',
            scope: true,
            controller: function ($scope) {

                var width = 960;
                var height = 500;

                var svg = d3.select('#geographic-map');
                var allGroup = svg.append('g');
                var countryGroup = allGroup.append('g');
                var statesGroup = allGroup.append('g');

                var mapJSONCache = {
                    world: null,
                    states: null
                };

                var projection = d3.geo.mercator()
                    .rotate([0, 0])
                    .scale(155)
                    .precision(9)
                    .center([0, 20]);

                var mapPath = d3.geo.path()
                    .projection(projection);

                $scope.zoomedToUSA = false;
                $scope.areaData = null;

                function drawWorldMap(mapJSON, analyticsData) {

                    var map = drawMap(countryGroup, 'countries', mapJSON, analyticsData);

                    // Add Zoom to USA
                    countryGroup.selectAll('path')
                        .filter(function (d) {
                            return d.properties.names[0] === 'United States';
                        })
                        .on('mousedown', function (d) {
                            toggleUSAZoom(function () {
                                showStatesMap();
                            });
                        });

                    return map;
                }

                function drawStatesMap(mapJSON, analyticsData) {
                    return drawMap(statesGroup, 'states', mapJSON, analyticsData)
                        .on('mousedown', function () {
                            toggleUSAZoom(function () {
                                showWorldMap();
                            });
                        });
                }

                function drawMap(group, feature, mapJSON, analyticsData, stat) {

                    var colorRange = quantize(analyticsData, stat || 'plays');

                    group.selectAll('path')
                        .data(topojson.feature(mapJSON, mapJSON.objects[feature]).features)
                        .enter()
                        .append('path')
                        .attr('d', mapPath);

                    group.selectAll('path')
                        .attr('stroke', '#FFF')
                        .attr('stroke-width', '0.5')
                        .attr('fill', function (d) {
                            var datum = getData(analyticsData, d);
                            if (datum && datum.metrics.video && datum.metrics.video[stat || 'plays']) {
                                return colorRange(datum.metrics.video[stat || 'plays']);
                            } else {
                                return colorRange(0);
                            }
                        })
                        .on('mouseover', _.partial(displayData, analyticsData));

                    return group.selectAll('path');

                }

                function quantize(dataSet, stat) {
                    var values = _(dataSet).pluck('metrics').pluck('video').pluck(stat).map(Number).value();
                    return d3.scale.log()
                        .domain([1, d3.max(values)])
                        .interpolate(d3.interpolateRgb)
                        .range(['#5bccf6', '#285F74'])
                        .clamp(true);
                }

                function getData(dataSet, d) {
                    return _.find(dataSet, function (resultArea) {
                        return _.contains(d.properties.names, resultArea.name);
                    });
                }

                function displayData(dataSet, d) {
                    var datum = getData(dataSet, d);
                    $scope.$apply(function () {
                        $scope.areaData = datum;
                    });

                }

                function getDataForWorldMap(callback) {
                    GeographicService.getOne($scope.video.videoID).then(function (data) {
                        var results = _(data.geographic.results.world).map(function (result) {
                            return _.extend({name: result.name}, result.metrics.video);
                        }).value();
                        $scope.setResults('name', 'Name', null, null, results);
                        callback(data.geographic.results.world);
                    });
                }

                function getDataForStatesMap(callback) {
                    GeographicService.getOne($scope.video.videoID).then(function (data) {
                        var results = _(data.geographic.results.usa).map(function (result) {
                            return _.extend({name: result.name}, result.metrics.video);
                        }).value();
                        $scope.setResults('name', 'Name', null, null, results);
                        callback(data.geographic.results.usa);
                    });
                }

                function showWorldMap() {

                    getDataForWorldMap(function (analyticsData) {
                        if (mapJSONCache.world) {
                            drawWorldMap(mapJSONCache.world, analyticsData);
                        } else {
                            $http({method: 'GET', url: '/static/api/world-110m.json'}).success(function (mapData) {
                                mapJSONCache.world = mapData;
                                drawWorldMap(mapData, analyticsData);
                            });
                        }
                    });

                }

                function showStatesMap() {
                    getDataForStatesMap(function (analyticsData) {
                        if (mapJSONCache.states) {
                            drawStatesMap(mapJSONCache.states, analyticsData);
                        } else {
                            $http({method: 'GET', url: '/static/api/us2.json'}).success(function (mapData) {
                                mapJSONCache.states = mapData;
                                drawStatesMap(mapData, analyticsData);
                            });
                        }
                    });
                }

                function zoomToUSA(callback) {

                    var scale = 2.2;
                    var xOffset = 220;
                    var yOffset = 100;
                    var x = -(width / scale) + xOffset;
                    var y = -(height / scale) + yOffset;

                    countryGroup
                        .selectAll('path')
                        .transition()
                        .duration(500)
                        .attr('fill', '#CBDEE5')
                        .attr('stroke', '#CCC');

                    allGroup.transition()
                        .duration(750)
                        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + scale + ')translate(' + x + ',' + y + ')')
                        .style('stroke-width', 1.5 / scale + 'px')
                        .each('end', callback);
                }

                function zoomFromUSA(callback) {

                    var scale = 1;
                    var xOffset = 480;
                    var yOffset = 250;
                    var x = -(width / scale) + xOffset;
                    var y = -(height / scale) + yOffset;

                    countryGroup
                        .selectAll('path')
                        .transition()
                        .duration(500)
                        .attr('fill', '#CCC')
                        .attr('stroke', '#CCC');

                    statesGroup
                        .selectAll('path')
                        .remove();

                    allGroup.transition()
                        .duration(750)
                        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + scale + ')translate(' + x + ',' + y + ')')
                        .style('stroke-width', 1.5 / scale + 'px')
                        .each('end', callback);

                }

                function toggleUSAZoom(callback) {

                    if ($scope.zoomedToUSA) {
                        zoomFromUSA(function () {
                            $scope.$apply(function () {
                                callback();
                                $scope.zoomedToUSA = false;
                            });
                        });
                    } else {
                        zoomToUSA(function () {
                            $scope.$apply(function () {
                                callback();
                                $scope.zoomedToUSA = true;
                            });
                        });

                    }

                }

                showWorldMap();

            }
        };
    }]);

    app.directive('plAnalyticsFieldsChooser', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-fields-chooser.html',
            controller: function ($scope) {

            }
        };
    }]);

    app.directive('plAnalyticsFieldsKey', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-fields-key.html',
            controller: function ($scope) {

            }
        };
    }]);

    app.directive('plAnalyticsResultsTable', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-results-table.html',
            controller: function ($scope) {

            }
        };
    }]);

    app.directive('plAnalyticsEngagement', ['$rootScope', '$timeout', function () {
        return {
            restrict: 'E',
            templateUrl: '/static/views/directives/analytics-engagement.html',
            link: function (scope, elem, attrs) {
            }
        };
    }]);

})(window, document, window.angular, 'RomeoApp', 'analytics');