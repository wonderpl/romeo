angular.module('RomeoApp.analytics').directive('plAnalyticsEngagementVideoSegment', ['$rootScope', 'EngagementService', '$document', function ($rootScope, EngagementService, $document) {

    'use strict';

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
                    };
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
                        return x($document.time);
                    })
                    .y0(chartAreaHeight)
                    .y1(function (d) {
                        return y($document.plays);
                    });

                // A line generator, for the dark stroke.
                var line = d3.svg.line()
                    .interpolate('monotone')
                    .x(function (d) {
                        return x($document.time);
                    })
                    .y(function (d) {
                        return y($document.plays);
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
                    return $document.plays;
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
                    .style('text-anchor', 'end');

            });

        }
    };
}]);