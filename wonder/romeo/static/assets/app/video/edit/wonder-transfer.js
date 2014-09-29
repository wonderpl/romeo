(function () {
  'use strict';

  function WonderTransferModal ($templateCache, UserService, modal) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/edit/wonder-transfer.modal.html'),
      scope: true,
      controller: function ($scope) {
        $scope.connections = [];
        $scope.invite = {
          permissions : 'canDownload',
          collaborators : []
        };

        $scope.select2Options = {
          width: '100%',
          simple_tags: true,
          multiple: true,
          data: function () {
            return { results: $scope.connections };
          },
          createSearchChoice: function (term) {
            return {id: term, text: term};
          },
          initSelection: function (element, callback) {
            var data = [];
            $(element.val().split(",")).each(function () {
              data.push({id: this, text: this});
            });
            callback(data);
          },
          formatResult: function (obj) {
            return '<div class="media"><span class="media__img avatar avatar--small"><img src="' + (obj.avatar || '/static/assets/img/user-avatar.png') + '" class="avatar__img"></span> ' + obj.text + '</div>';
          },
          formatSelection: function (obj) {
            var connection = findConnectionById(obj.id || obj);
            return connection.text || connection.id;
          }
        };

        UserService.getConnections(true).then(function (data) {
          $scope.connections = data;
        });

        $scope.save = function () {

          $scope.$emit('notify', {
            status : 'success',
            title : 'Wonder Transfer',
            message : 'Your invitation has been sent'}
          );
          modal.hide();
        };

        function findConnectionById(id) {
          for (var i = 0; i < $scope.connections.length; ++i) {
            if ($scope.connections[i].id == id)
              return $scope.connections[i];
          }
          return { id: id };
        }
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoEditWonderTransfer', ['$templateCache', 'UserService', 'modal', WonderTransferModal]);

})();