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

                $scope.overview = {};

                OverviewService.get($scope.analytics.video.videoID).then(function (data) {
                    $scope.overview.data = data;
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

    app.directive('plAnalyticsPerformanceChart', ['$rootScope', '$timeout', 'Enum', 'PerformanceService', function ($rootScope, $timeout, Enum, PerformanceService) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-performance.html',
            scope: true,
            controller: function ($scope) {

                // Must return an array of series with {key: value}
                function convertDataToChartFormat(data) {

                    var visibleFields = $scope.getFields({visible: true});
                    return _.map(visibleFields, function (field) {
                        return {
                            key: field.displayName,
                            values: _.map(data, function (datum) {
                                return {
                                    name: field.field,
                                    date: datum.dateObj,
                                    value: field.field === 'date' ? moment(datum[field.field]).toDate() : datum[field.field]
                                };
                            }),

                            color: field.color
                        }
                    });

                }

                function drawGraph(chartData) {

                    nv.addGraph(function () {

                        function draw(chartData, chartWidth, chartHeight) {
                            d3.select('#performance-chart')
                                .attr('height', chartHeight)
                                .attr('width', chartWidth)
                                .datum(chartData)
                                .transition().duration(500)
                                .call(chart);
                        }

                        var chartHeight = 350;
                        var chartWidth = 960;

                        var xTickValues = d3.time.scale()
                            .domain(_.pluck(chartData[0].values, 'date'))
                            .ticks(d3.time.day, chartData);

                        var yTickValues = d3.scale.linear()
                            .domain([0, d3.max(_(chartData).pluck('values').flatten().pluck('value').value())])
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

                        draw(chartData);

                        nv.utils.windowResize(chart.update);

                        $scope.$watch('fields', function () {
                            draw(convertDataToChartFormat($scope.analytics.results.results));

                        }, true);

                        return chart;
                    });

                }

                function setTableResults(data) {
                    $scope.analytics.results.key = 'date';
                    $scope.analytics.results.keyDisplayName = 'Date';
                    $scope.analytics.results.results = data;
                }

                function getPerformanceData() {
                    return PerformanceService.get($scope.analytics.video.videoID, $scope.analytics.dateFrom, $scope.analytics.dateTo);
                }

                getPerformanceData().then(function (data) {

                    _(data).forEach(function (datum) {
                        datum.dateObj = moment(datum.date, 'YYYY-MM-DDW').toDate();
                    });

                    setTableResults(data);

                    $scope.$watch('analytics.fields', function() {
                        drawGraph(convertDataToChartFormat(data));
                    });

                    $scope.$on('fields/change', function() {
                        drawGraph(convertDataToChartFormat(data));
                    });

                });




            }
        };
    }]);

    app.directive('plAnalyticsGeographicMap', ['$rootScope', '$timeout', '$http', '$q', 'GeographicService', function ($rootScope, $timeout, $http, $q, GeographicService) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-geographic.html',
            scope: true,
            controller: function ($scope) {

                var mapWidth = 1024;
                var mapHeight = 550;

                var svg = d3.select('#geographic-map');
                var allGroup = svg.append('g');
                var countryGroup = allGroup.append('g');
                var statesGroup = allGroup.append('g');

                var projection = d3.geo.mercator()
                    .rotate([0, 0])
                    .scale(155)
                    .precision(9)
                    .center([0, 20]);


                var mapPath = d3.geo.path()
                    .projection(projection);

                var zoomRegions = $scope.zoomRegions = {
                    world: {
                        name: 'World',
                        regionId: '',
                        zoomObj: {
                            scale: 1 ,
                            x: -(mapWidth) + 512,
                            y: -(mapHeight) + 275
                        },
                        feature: 'countries',
                        group: countryGroup,
                        fieldDisplayName: 'Country'
                    },
                    usa: {
                        name: 'USA',
                        regionId: 'us',
                        zoomObj: {
                            scale: 2.2,
                            x: -(mapWidth / 2.2) + 220,
                            y: -(mapHeight / 2.2) + 100
                        },
                        feature: 'states',
                        group: statesGroup,
                        fieldDisplayName: 'State'
                    }
                };

                $scope.selectedRegion = zoomRegions.world;
                $scope.analytics.selectedMapField = $scope.getFields({field: 'plays'})[0];

                $scope.zoomToRegion = function(region) {
                    var zoomDeferred = $q.defer();

                    var dataDeferred = getGeographicData();
                    var mapDeferred = getMapData();

                    setRegionZoom(region.zoomObj, function() {
                        zoomDeferred.resolve(true);
                    });

                    $q.all([dataDeferred, mapDeferred, zoomDeferred.promise]).then(function(data) {
                        // Make this cleaner in future
                        var mapDeferred = showMap();
                        switch($scope.selectedRegion.name) {
                            case 'USA':
                                mapDeferred.then(function() {
                                    greyMap(countryGroup);
                                });
                                break;
                            default:
                                mapDeferred.then(function() {
                                    statesGroup.selectAll('path').remove();
                                });
                                break;
                        }
                    })
                };

                function quantize(geoData) {
                    var color = d3.rgb($scope.analytics.selectedMapField.color);
                    var values = _(geoData)
                        .pluck('video')
                        .pluck($scope.analytics.selectedMapField.field)
                        .map(Number)
                        .value();

                    return d3.scale.log()
                        .domain([1, d3.max(values)])
                        .interpolate(d3.interpolateRgb)
                        .range([color.brighter(0.2), color.darker(2)])
                        .clamp(true);
                }

                function drawMap(mapGroup, mapJSON) {
                    var feature = $scope.selectedRegion.feature;
                    return mapGroup.selectAll('path')
                        .data(topojson.feature(mapJSON, mapJSON.objects[feature]).features)
                        .enter()
                        .append('path')
                        .attr('d', mapPath);

                }

                function styleMap(mapGroup) {
                    mapGroup.selectAll('path')
                        .attr('stroke', '#FFF')
                        .attr('stroke-width', '0.5');
                }

                function colorizeMap(mapGroup, geoData) {
                    var color = d3.rgb($scope.analytics.selectedMapField.color);
                    color.tweak = function(h, s, l) {
                        var hsl = this.hsl();
                        return d3.hsl(hsl.h + h, hsl.s + s, hsl.l + l).toString();
                    };
                    mapGroup.selectAll('path')
                        .attr('fill', function (d) {
                            var datum = _(geoData).find(function(datum) {
                                return _.contains(d.properties.names, datum.geo.name);
                            });
                            var colorize = quantize(geoData);
                            if (datum && datum.video && datum.video[$scope.analytics.selectedMapField.field]) {
                                return colorize(datum.video[$scope.analytics.selectedMapField.field]);
                            } else {
                                return color.tweak(0, -0.2, 0.2);
                            }
                        })
                }

                function greyMap(mapGroup) {
                    mapGroup.selectAll('path')
                        .attr('fill', 'rgb(235, 235, 235)');

                }

                function setRegionZoom(zoomObj, callback) {
                    callback = callback || function() {};
                    allGroup.transition()
                        .duration(750)
                        .attr('transform', 'translate(' + mapWidth / 2 + ',' + mapHeight / 2 + ')scale(' + zoomObj.scale + ')translate(' + zoomObj.x + ',' + zoomObj.y + ')')
                        .style('stroke-width', 1.5 / zoomObj.scale + 'px')
                        .each('end', callback);
                }


                function showMap() {

                    return $q.all([getMapData(), getGeographicData()]).then(function(data) {
                        var mapData = data[0], geoData = data[1];
                        drawMap($scope.selectedRegion.group, mapData);
                        styleMap($scope.selectedRegion.group);
                        colorizeMap($scope.selectedRegion.group, geoData);
                        _(zoomRegions).pluck('group').forEach(detachMouseEvents);
                        attachMouseEvents($scope.selectedRegion.group, geoData);

                        var tableData = _(geoData).map(function(datum) {
                            datum.video.name = datum.geo.name;
                            return datum.video;
                        }).value();

                        $scope.analytics.results.key = 'name';
                        $scope.analytics.results.keyDisplayName = $scope.selectedRegion.fieldDisplayName;
                        $scope.analytics.results.results = tableData;

                    });

                }

                function getMapData() {
                    return  GeographicService.getMap($scope.selectedRegion);
                }

                function getGeographicData() {
                    return GeographicService.get($scope.analytics.video.videoID, $scope.selectedRegion, $scope.analytics.dateFrom, $scope.analytics.dateTo);
                }

                function mouseOverHandler(geoData, d) {
                    var datum = _(geoData).find(function(datum) {
                        return _.contains(d.properties.names, datum.geo.name);
                    });
                    $scope.$apply(function(){
                        $scope.areaData = datum;
                    });
                }

                function mouseOutHandler(geoData, d) {
                    $scope.areaData = null;
                }

                function attachMouseEvents(group, geoData) {
                    group.selectAll('path').on('mouseover', _.partial(mouseOverHandler, geoData));
                    group.selectAll('path').on('mouseout', _.partial(mouseOutHandler, geoData));
                }

                function detachMouseEvents(group) {
                    group.selectAll('path').on('mouseover', null);
                    group.selectAll('path').on('mouseexit', null);
                }

                $scope.$watch('analytics.selectedMapField', function() {
                    showMap();
                });

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

    app.directive('plAnalyticsEngagementVideoSegment', ['$rootScope', '$timeout', 'EngagementService', function ($rootScope, $timeout, EngagementService) {
        return {
            restrict: 'A',
            templateUrl: '/static/views/directives/analytics-engagement-video-segment.html',
            link: function (scope, elem, attrs) {

            },
            controller: function ($scope) {

                $scope.embedSrc = '/embed/' + $scope.analytics.video.videoID;
                //var frame = $scope.video_iframe = document.getElementById('engagement-video-iframe').contentWindow;

                // Get the data we need
                EngagementService.get($scope.analytics.video.videoID, $scope.analytics.dateFrom, $scope.analytics.dateTo).then(function (data) {

                    var width = 500;
                    var height = 300;
                    var chartAreaMargin = {top: 30, right: 30, bottom: 30, left: 60};
                    var chartAreaWidth = width - chartAreaMargin.left - chartAreaMargin.right;
                    var chartAreaHeight = height - chartAreaMargin.top - chartAreaMargin.bottom;

                    var OO, wonder;

                    var chartData = data.engagement.segments_watched.map(function (plays, index) {
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

                                    setProgress(time * 1000);

                                }
                            );

                        }
                    }, 100);

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
