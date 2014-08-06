angular
  .module('RomeoApp.directives')
  .directive('notificationTray', ['$templateCache', '$timeout', NotificationTrayDirective]);

function NotificationTrayDirective ($templateCache, $timeout) {

  'use strict';

  function removeNotificationData (index) {
    $scope.notifications[index].active = false;
  }

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('notification-tray.html'),
    scope : {
      notifications : '='
    },
    controller : function ($scope) {

      console.log('test');

      $scope.notifications = $scope.notifications || [];

      $scope.removeNotification = function (id) {
        console.log('removeNotification');
        var notifications = $scope.notifications;
        var l = notifications.length;
        var notification = null;
        while (l--) {
          if (notifications[l].id === id) {
            removeNotificationData(l);
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
          if (current - notifications[l].timestamp > 5000 && notifications[l].status !== 'error' && notifications[l].active) {
            notifications[l].active = false;
          }
          if (current - notifications[l].timestamp > 10000 && !notifications[l].active) {
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
          id        : Math.round(Math.random() * 10000000)
        };
        console.log(notification);
        $scope.notifications.push(notification);
        $timeout(function () {
          notification.active = true;
        }, 1000);

      });

      $scope.pollNotifications();
    }
  };
}
