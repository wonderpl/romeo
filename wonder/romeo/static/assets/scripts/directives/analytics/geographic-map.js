angular.module('RomeoApp.analytics').directive('plAnalyticsGeographicMap',
    ['$rootScope', '$http', '$q', 'GeographicService', '$document',
    function ($rootScope, $http, $q, GeographicService, $document) {

    'use strict';

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
                });
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
                            return _.contains($document.properties.names, datum.geo.name);
                        });
                        var colorize = quantize(geoData);
                        if (datum && datum.video && datum.video[$scope.analytics.selectedMapField.field]) {
                            return colorize(datum.video[$scope.analytics.selectedMapField.field]);
                        } else {
                            return color.tweak(0, -0.2, 0.2);
                        }
                    });
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
                    return _.contains($document.properties.names, datum.geo.name);
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