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

                function mouseOverEventHandler(analyticsData, feature) {


                }

                function mouseDownEventHandler(analyticsData, feature) {

                }

                function drawWorldMap(mapJSON, analyticsData) {

                    var map = drawMap(countryGroup, 'countries', mapJSON, analyticsData);

                    // Add Zoom to USA
                    countryGroup.selectAll('path')
                        .attr('class', 'country')
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

                    statesGroup.selectAll('path').attr('class', 'state');

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
                        .on('mouseover', _.partial(displayData, analyticsData, feature));

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

                function displayData(dataSet, feature, d) {
                    var datum = getData(dataSet, d);

                    if (($scope.zoomedToUSA && feature === 'states') || (!$scope.zoomedToUSA && feature === 'countries')) {
                        $scope.$apply(function () {
                            $scope.areaData = datum;
                        });
                    }

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

    app.directive('plAnalyticsEngagementVideoSegment', ['$rootScope', '$timeout', 'StatsService', function ($rootScope, $timeout, StatsService) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-engagement-video-segment.html',
            link: function (scope, elem, attrs) {

            },
            controller: function ($scope) {

                var frame = $scope.video_iframe = document.getElementById('engagement-video-iframe').contentWindow;



                // Get the data we need
                StatsService.getOne($scope.video.videoID).then(function (data) {

                    var width = 500;
                    var height = 300;
                    var chartAreaMargin = {top: 30, right: 30, bottom: 30, left: 60};
                    var chartAreaWidth = width - chartAreaMargin.left - chartAreaMargin.right;
                    var chartAreaHeight = height - chartAreaMargin.top - chartAreaMargin.bottom;

                    var OO, wonder;


                    var chartData = data.engagement.results[0].metrics.engagement.segments_watched.map(function (plays, index) {
                        return {
                            time: index * 2500,
                            plays: ~~plays
                        }
                    });
                    var svg = d3.select('#engagement-video-segment-chart');

                    // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
                    var x = d3.time.scale().range([0, chartAreaWidth]).clamp(true),
                        y = d3.scale.linear().range([chartAreaHeight, 0]),
                        xAxis = d3.svg.axis().scale(x)

                            .tickSize(-chartAreaHeight)
                            .tickFormat(function (d) {
                                return moment(d).format('mm:ss');
                            }),
                        yAxis = d3.svg.axis().scale(y).orient('left');

                    // An area generator, for the light fill.
                    var area = d3.svg.area()
                        .interpolate('monotone')
                        .x(function (d) {
                            return x(d.time);
                        })
                        .y0(chartAreaHeight)
                        .y1(function (d) {
                            return y(d.plays);
                        });

                    // A line generator, for the dark stroke.
                    var line = d3.svg.line()
                        .interpolate('monotone')
                        .x(function (d) {
                            return x(d.time);
                        })
                        .y(function (d) {
                            return y(d.plays);
                        });

                    var setProgress = function (ms) {
                        var left = x(ms);
                        progressLine
                            .transition()
                            .duration(100)
                            .attr('x1', left + chartAreaMargin.left)
                            .attr('x2', left + chartAreaMargin.left);
                        progressClip
                            .transition()
                            .duration(100)
                            .attr('width', left);
                    };

                    var timeClickHandler = function () {
                        var offset = d3.mouse(svg.node())[0] - chartAreaMargin.left;
                        wonder.setPlayheadTime(x.invert(offset) / 1000);
                    };

                    var inter = window.setInterval(function () {
                        if (typeof frame.wonder === 'object') {
                            window.clearInterval(inter);
                            OO = frame.OO;
                            wonder = frame.wonder;

                            wonder.mb.subscribe(
                                frame.OO.EVENTS.PLAYHEAD_TIME_CHANGED,
                                'analytics',
                                function (event, time, duration, buffer, seekrange) {

                                    console.log(event);
                                    console.log(time);
                                    console.log(duration);
                                    setProgress(time * 1000);

                                }
                            );

                            debugger;

                        }
                    }, 100);


                    // Compute the minimum and maximum date, and the maximum price.
                    x.domain([chartData[0].time, chartData[chartData.length - 1].time]);
                    y.domain([0, d3.max(chartData, function (d) {
                        return d.plays;
                    })]).nice();

                    xAxis.tickValues(x.ticks(d3.time.second, 15).concat([chartData[chartData.length - 1].time]));

                    // Add an SVG element with the desired dimensions and margin.
                    svg
                        .attr('width', width)
                        .attr('height', height)
                        .append('g');

                    // Add the clip path.
                    svg.append('clipPath')
                        .attr('id', 'clip')
                        .append('rect')
                        .attr('width', width)
                        .attr('height', height);

                    // Add the clip path.
                    var progressClip = svg.append('clipPath')
                        .attr('id', 'clip-progress')
                        .append('rect')
                        .attr('width', chartAreaWidth)
                        .attr('height', chartAreaHeight);

                    /*
                     var clickListener = svg
                     .append('rect')
                     .attr('width', chartAreaWidth)
                     .attr('height', chartAreaHeight)
                     .attr('transform', _.template('translate(${left},${top})', chartAreaMargin))
                     .on('click', function() {
                     var offset = d3.mouse(svg.node() - chartAreaMargin.left);
                     left(x.invert(offset[0]));
                     });
                     */

                    // Add the area path.
                    svg.append('path')
                        .attr('class', 'area')
                        .attr('clip-path', 'url(#clip)')
                        .attr('transform', _.template('translate(${left},${top})', chartAreaMargin))
                        .attr('d', area(chartData))
                        .on('click', timeClickHandler);

                    // Add the area path.
                    svg.append('path')
                        .attr('class', 'progress-area')
                        .attr('clip-path', 'url(#clip-progress)')
                        .attr('transform', _.template('translate(${left},${top})', chartAreaMargin))
                        .attr('d', area(chartData))
                        .on('click', timeClickHandler);

                    // Add the x-axis.
                    svg.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', _.template('translate(${left},${top})', {top: chartAreaHeight + chartAreaMargin.top + 5, left: chartAreaMargin.left}))
                        .call(xAxis);

                    // Add the y-axis.
                    svg.append('g')
                        .attr('class', 'y axis')
                        .attr('transform', _.template('translate(${left},${top})', {top: chartAreaMargin.top, left: chartAreaMargin.left}))
                        .call(yAxis);

                    var progressLine = svg.append('line')
                        .attr('class', 'line')
                        .attr('stroke-width', '2px')
                        .attr('stroke', 'black')
                        .attr('x1', chartAreaMargin.left)
                        .attr('y1', chartAreaMargin.top)
                        .attr('x2', chartAreaMargin.left)
                        .attr('y2', chartAreaHeight + chartAreaMargin.top);


                    // Add the line path.
                    svg.append('path')
                        .attr('class', 'line')
                        .attr('clip-path', 'url(#clip)')
                        .attr('transform', _.template('translate(${left},${top})', chartAreaMargin))
                        .attr('d', line(chartData));

                    // Add a small label for the symbol name.
                    svg.append('text')
                        .attr('x', width - 6)
                        .attr('y', height - 6)
                        .style('text-anchor', 'end')

                });

            }
        };
    }]);

})(window, document, window.angular, 'RomeoApp', 'analytics');
