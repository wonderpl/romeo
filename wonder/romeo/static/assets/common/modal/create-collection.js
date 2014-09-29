//create-collection.js
(function () {
  'use strict';

  function CreateCollection ($templateCache, modal, TagService) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('modal/create-collection.modal.html'),
      scope : true,
      controller : function ($scope) {
        $scope.collection = $scope.collection || { scope: 'private' };

        if (typeof $scope.close !== 'function') {
          $scope.close = function ($event) {
            modal.hide();
          };
        }

        $scope.save = function () {
          var label = $scope.collection.label;
          var description = $scope.collection.description;
          var isPublic = $scope.collection.scope === 'public';

          var data = {
            label       : label,
            description : description,
            public      : isPublic
          };

          TagService.createTag(data).then(function (tag) {
            TagService.getTags().then(function (data) {
              $scope.tags = data.tag.items;
              console.dir(tag);
              if ($scope.addVideoToCollection) {
                $scope.addTag(tag.id);
                $scope.addVideoToCollection = false;
              }
              $scope.close(); // Close modal window
              $scope.$emit('notify', {
                status : 'success',
                title : 'New Collection Created',
                message : 'Collection details saved.'}
              );
              $scope.$emit('created-new-tag', tag);
            });
          });
        };

        $scope.hasTagLabel = function (label) {
          var tags = $scope.tags || [];
          var l = tags.length;
          while (l--) {
            if (tags[l].label == label) {
              return true;
            }
          }
          return false;
        };
      }
    };
  }

  angular.module('RomeoApp.modal').directive('modalCreateCollection', ['$templateCache', 'modal', 'TagService', CreateCollection]);


angular
  .module('RomeoApp.directives')
  .directive('validateCollectionTitle', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$setValidity('exists', true);
        ctrl.$parsers.unshift(function(viewValue) {
          var exists = scope.hasTagLabel(viewValue);
          ctrl.$setValidity('exists', !exists);
          return exists ? undefined : viewValue;
        });
      }
    };
  });
})();