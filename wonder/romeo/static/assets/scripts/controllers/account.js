angular.module('RomeoApp.controllers').controller('AccountCtrl',
    ['$scope', 'AccountService', '$timeout',
    function ($scope, AccountService, $timeout) {

    'use strict';

    /*
    * State object representing whether the user is in Edit mode or not
    */
    $scope.isEditable = false;

    /*
    * State objects representing the state of the image uploads
    */
    $scope.coverImageUploading = false;
    $scope.avatarImageUploading = false;

    /*
    * Toggle the isEditable state of the scope
    */
    $scope.toggleEditable = function() {
        $timeout(function() {
            $scope.$apply(function() {
                $scope.isEditable = !$scope.isEditable;
            });
        });
    };

    /*
    * The user has selected a cover image via the file input
    * First callback: Successfully uploaded file
    * Second callback: Error
    * Third callback: Notification
    */
    $scope.coverImageSelected = function($files) {
        $scope.coverImageUploading = true;
        AccountService.updateCoverImage($files[0]).then(function(response){
            $scope.coverImageUploading = false;
            if ( $scope.avatarUploading === false ) {
                $scope.isEditable = false;
            }
            AccountService.getUser();
        }, function(){
        }, function(response){
            $scope.coverImageUploading = true;
            FlashService.flash( 'There was an error uploading your cover image, please try again', 'error');
        });
    };

    /*
    * The user has selected an avatar image via the file input
    * First callback: Successfully uploaded file
    * Second callback: Error
    * Third callback: notification
    */
    $scope.avatarImageSelected = function($files) {
        $scope.avatarUploading = true;
        AccountService.updateAvatar($files[0]).then(function(response){
            $scope.avatarUploading = false;
            if ( $scope.coverImageUploading === false ) {
                $scope.isEditable = false;
            }
            AccountService.getUser();
        }, function(){
        }, function(response){
            $scope.avatarUploading = true;
            FlashService.flash( 'There was an error uploading your cover image, please try again', 'error');
        });
    };

    /*
    * Listen for autosave broadcasts from our auto-save-field directives
    */
    $scope.$on('autosave', function(e, attr, val, date){
        var data = {};
        data[attr] = val;
        AccountService.updateUser(data);
        // .then(function(){
        //     AccountService.getUser();
        // });
    });

}]);
