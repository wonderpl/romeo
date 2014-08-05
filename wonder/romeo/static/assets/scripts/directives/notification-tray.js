angular
  .module('RomeoApp.directives')
  .directive('notificationTray', ['$templateCache', '$timeout', NotificationTrayDirective]);

function NotificationTrayDirective ($templateCache, $timeout) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('notification-tray.html'),
    scope : {
      notifications : '='
    },
    controller : function ($scope) {

      $scope.notifications = $scope.notifications || [];

      $scope.removeNotification = function (id) {
        console.log('removeNotification');
        var notifications = $scope.notifications;
        var l = notifications.length;
        var notification = null;
        while (l--) {
          if (notifications[l].id === id) {
            notification = notifications[l];
            notifications.splice(l, 1);
            break;
          }
        }
        return notification;
      };

      $scope.pollNotifications = function () {
        var notifications = $scope.notifications || [];
        var current = new Date().getTime();
        var l = notifications.length;
        while (l--) {
          if (current - notifications[l].timestamp > 5000 && notifications[l].status !== 'error') {
            notifications.splice(l, 1);
            break;
          }
        }
        $timeout($scope.pollNotifications, 1000);
      };

      $scope.$on('notify-tray', function (event, data) {
        var notification = {
          status    : data.status,
          title     : data.title,
          message   : data.message,
          timestamp : new Date().getTime(),
          id        : Math.round(Math.random() * 10000000)
        }
        console.log(notification);
        $scope.notifications.push(notification);

      });

      $scope.pollNotifications();
    }
  };
}
