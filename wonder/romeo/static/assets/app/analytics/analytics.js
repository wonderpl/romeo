(function () {
    'use strict';
    var debug = new DebugClass('RomeoApp.analytics');


    function AnalyticsRouteProvider($routeProvider, securityAuthorizationProvider) {
        // Account management
        $routeProvider.when('/analytics', {
            templateUrl: 'analytics/analytics.tmpl.html',
            controller: 'AnalyticsCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });
    }

    angular.module('RomeoApp.analytics').config(['$routeProvider', 'securityAuthorizationProvider', AnalyticsRouteProvider]);


    function AnalyticsCtrl($scope) {
        function init() {

        }

        init();
    }
    angular.module('RomeoApp.analytics').controller('AnalyticsCtrl', ['$scope', AnalyticsCtrl]);

    // bar chart data
    var barData = {
    labels : ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    datasets : [
        {
            fillColor : "#51B364",
            strokeColor : "#000",
            data : [78,57,70,70,40,30,58]
        }
        ]
    };
    
    // get bar chart canvas
    var income = document.getElementById("income").getContext("2d");
        
    // draw bar chart
    new Chart(income).Bar(barData , {
        barShowStroke: false,
        responsive: true,
        maintainAspectRatio: true,
        scaleLineColor: "#f1f2f2",
        scaleFontStyle: "bold",
        scaleFontSize: 13,
        scaleFontFamily: "'FreightSans Pro', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif",
        scaleFontColor: "#2e2e32",
        tooltipFillColor: "#2e2e32",
        tooltipFontStyle: "bold",
        tooltipFontSize: 16,
        tooltipFontFamily: "'FreightSans Pro', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif",
        tooltipFontColor: "#fff",
        tooltipTitleFontStyle: "normal",
        tooltipTitleFontSize: 13,
        tooltipTitleFontFamily: "'FreightSans Pro', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif",
        tooltipTitleFontColor: "#2e2e32",
        tooltipYPadding: 10,
        tooltipXPadding: 10,
        tooltipCaretSize: 6,
        tooltipCornerRadius: 3,
        tooltipXOffset: 2
    });

})();