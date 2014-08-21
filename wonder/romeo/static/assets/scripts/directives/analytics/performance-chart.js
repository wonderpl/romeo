angular.module('RomeoApp.analytics').directive('plAnalyticsPerformanceChart', ['$rootScope', 'Enum', 'PerformanceService', '$document', function ($rootScope, Enum, PerformanceService, $document) {

    'use strict';

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
                    };
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
                            return $document.date;
                        })
                        .y(function (d) {
                            return $document.value;
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
