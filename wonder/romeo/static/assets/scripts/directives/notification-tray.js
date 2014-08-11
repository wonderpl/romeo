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

      $scope.removeNotificationData = function (index) {
        $scope.notifications[index].show = false;
        $scope.notifications[index].hide = true;
      };

      $scope.removeNotification = function (id) {
        console.log('removeNotification');
        var notifications = $scope.notifications;
        var l = notifications.length;
        var notification = null;
        while (l--) {
          if (notifications[l].id === id) {
            $scope.removeNotificationData(l);
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
          if (current - notifications[l].timestamp > 2500 && notifications[l].active) {
            notifications[l].hide = true;
            notifications[l].show = false;
          }
          if (current - notifications[l].timestamp > 3000 && notifications[l].hide) {
            notifications[l].active = false;
            $scope.notifications.splice(l, 1);
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
          id        : Math.round(Math.random() * 10000000),
          active    : true,
          show      : true,
          hide      : false 
        };
        console.log(notification);
        $scope.notifications.push(notification);
      });

      $scope.pollNotifications();
    }
  };
}
