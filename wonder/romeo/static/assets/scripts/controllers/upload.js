angular.module('RomeoApp.controllers').controller('UploadCtrl',
    ['$scope', '$timeout', 'VideoService', '$modal', 'animLoop', 'prettydate', '$interval', '$q', 'FlashService',
    function($scope, $timeout, VideoService, $modal, animLoop, prettydate, $interval, $q, FlashService) {

    'use strict';

    /*
    * The state object for the chosen category for the video
    */
    $scope.chosenCategory = {
        id: undefined,
        label: undefined
    };

    /*
    * The state object used by the quick share modal - stores the addresses
    */
    $scope.shareAddresses = [];

    /*
    * The state object for showing file upload progress
    */
    $scope.file = {
        upload: {
            progress: 0
        },
        data: null,
        state: "empty"
    };

    /*
    * State object for remembering changes to the video record, before the title is added
    */
    $scope.deferredData = {};

    /*
    * State object for the actual Video record
    */
    $scope.video = {
        id: null,
        href: null,
        status: null,
        title: "",
        description: "",
        category: null,
        player_url: null
    };

    /*
    * State object for the click-more-data
    */
    $scope.clickToMore = {
        text: "",
        link: ""
    };
    $scope.showClickToMore = false;

    /*
    * State objects showing which thumbnail has been selected out of the available video thumbnails
    */
    $scope.previewIndex = 0;
    $scope.chosenPreviewImage = null;
    $scope.previewImages = [];

    /*
    * The state object for autosaving the video
    */
    $scope.status = {
        saved: null,
        date: null,
        updateInterval: $interval(function(){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.status.saved = $scope.status.saved !== null ? prettydate($scope.status.date) : null;
                });
            });
        },  30000)
    };

    /*
    * Cache the element we use for showing save status
    */
    $scope.$draftStatusMessage = $('#upload-draft-status');

    /*
    * Get the list of categories from the web service
    */
    VideoService.getCategories().then(function(data){
        $scope.categories = data.category.items;
    }, function(err){
        console.log(err);
    });

    /*
    * The user has chosen a new file, respond accordingly.
    */
    $scope.fileSelected = function($files){
        var name = $files[0].name.split('\\');
        $timeout(function(){
            $scope.$apply(function(){
                $scope.file.state = "chosen";
                $scope.file.data = $files[0];
                $scope.file.name = name[name.length-1];
            });
        });
    };

    /*
    * The user has confirmed that they have chosen the correct file to upload
    */
    $scope.startUpload = function() {

        $timeout(function(){
            $scope.$apply(function(){
                $scope.file.state = "uploading";
            });
        });

        VideoService.getUploadArgs().then(function(uploadArgs){

            var formData = new FormData();

            $.each(uploadArgs.fields, function () {
                formData.append(this.name, this.value);
                if (this.name == 'key') {
                    $scope.uploadPath = this.value;
                }
            });

            formData.append('file', $scope.file.data);

            $.ajax({
                url: uploadArgs.action,
                type: 'post',
                data: formData,
                processData: false,
                mimeType: 'multipart/form-data',
                contentType: false,
                xhr: $scope.uploadProgress
            })
            .done($scope.uploadSuccess)
            .fail($scope.uploadFail);

            animLoop.start();
        });
    };

    /*
    * Check the progress of the file upload adn update the UI
    */
    $scope.uploadProgress = function(){
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function (e) {
            $timeout( function() {
                $scope.$apply(function() {
                    var p = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
                    $scope.file.upload.progress = p;
                });
            });
        };
        return xhr;
    };

    /*
    * The file upload was a total shambles - respond to the error
    */
    $scope.uploadFail = function(response) {
        console.log(' UPLOAD FAILED ', arguments);
    };

    /*
    * The file upload was successful - take the next steps
    */
    $scope.uploadSuccess = function(response) {

        // update video properties in scope
        $timeout(function() {
            $scope.$apply(function(){
                $scope.video.filename = $scope.uploadPath;
                $scope.file.state = 'processing';
            });
        });

        // update filename for current video in scope
        $scope.updateVideo({ filename: $scope.uploadPath }).then(function() {

            // loop until scope file state is 'complete'
            $scope.processingInterval = setInterval(function(){

                if ( $scope.video.id !== null ) {
                    // Check for state change in the video record
                    VideoService.get($scope.video.id).then(function(response){
                        if ( response.status === 'ready' ) {
                            clearInterval($scope.processingInterval);

                            // get preview images for video in scope
                            VideoService.getPreviewImages($scope.video.id).then(function(response){
                                $timeout(function() {
                                    $scope.$apply(function() {
                                        $scope.previewImages = response.image.items;
                                    });
                                });
                            });

                            $timeout(function() {
                                $scope.$apply(function() {
                                    $scope.file.state = 'complete';
                                });
                            });
                        } else {
                        }
                    });
                }


            }, 10000);

        });
    };

    /*
    * Listen for autosave broadcasts from our auto-save-field directives
    */
    $scope.$on('autosave', function(e, attr, val, date){
        console.log('autosave caught', attr, val);
        $timeout(function(){
            $scope.$apply(function(){
                $scope.status.saved = prettydate(date);
                $scope.status.date = date;
                $scope.video[attr] = val;
                $scope.updateStatusMessage();
                $scope.showClickToMore = false;
                if ( $scope.video.id === null ) {
                    console.log( 'AUTOSAVED', $scope.video.title, $scope.video.title.length );
                    if ( $scope.video.title.length > 0 ) {
                        $scope.createVideo();
                    }
                } else {
                    var data = {};
                    data[attr] = val;
                    $scope.updateVideo(data);
                }
            });
        });
    });

    /*
    * Listen for broadcasts from the Autosave directives
    */
    $scope.$on('inputFocussed', function(e){
        $timeout(function() {
            $scope.$apply(function(){
                if ( $scope.showClickToMore === true ) {
                    $scope.showClickToMore = false;
                }
            });
        });
    });

    /*
    * Save the Click to more data when it is shown or hidden
    */
    $scope.$watch('showClickToMore', function(oldValue, newValue){
        if ( newValue === false ) {
            if ( $scope.clickToMore.text.length > 0 && $scope.clickToMore.link.match(/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/) !== null )
            $scope.updateVideo({ link_title: $scope.clickToMore.text, link_url: $scope.clickToMore.link });
            $scope.updateStatusMessage();
        }
    });

    /*
    * Update the draft status message
    */
    $scope.updateStatusMessage = function() {
        // $scope.$draftStatusMessage.removeClass('transitionable');
        // $timeout(function(){
        //     $scope.$draftStatusMessage.addClass('saved');
        // }, 10);
        // $timeout(function(){
        //     $scope.$draftStatusMessage.addClass('transitionable');
        // }, 20);
        // $timeout(function(){
        //     $scope.$draftStatusMessage.removeClass('saved');
        // }, 500);

        FlashService.flash('Saved', 'success');
    };

    /*
    * Create a video record ( if there is no valid video id present )
    */
    $scope.createVideo = function(e) {

        var deferred = new $q.defer();

        // Bundle in any deferred data
        var data = { title: $scope.video.title};
        angular.extend(data, $scope.deferredData);

        VideoService.create(data).then(function(response){
            $timeout( function() {
                $scope.$apply(function() {
                    console.log('record created successfully', arguments);
                    angular.extend($scope.video, response);
                    $scope.deferredData = {};
                    console.log( $scope.video );
                    deferred.resolve();
                });
            });
        });

        return deferred.promise;
    };

    /*
    * Update the video record
    */
    $scope.updateVideo = function(data) {

        var deferred = new $q.defer();

        if ( $scope.video.id !== null ) {
            VideoService.update($scope.video.id, data).then(function(response){
                $timeout( function() {
                    $scope.$apply(function() {
                        console.log('record updated successfully', arguments);
                        angular.extend($scope.video, response);
                        console.log( $scope.video );
                        deferred.resolve();
                    });
                });
            });
        } else {
            deferred.resolve();
            angular.extend($scope.deferredData, data);
        }

        return deferred.promise;
    };

    /*
    * Show the categories modal
    */
    $scope.showCategories = function(e) {
        $modal.load('modal-show-categories.html', true, $scope, { categories: $scope.categories });
    };

    /*
    * The user has clicked on a category in the categories modal
    */
    $scope.chooseCategory = function(e) {

        var el = e.target || e.srcElement,
            $el = angular.element(el);

        $timeout(function(){
            $scope.$apply(function(){
                $scope.video.category = $el.data('id');
                $scope.updateVideo({
                    category: $el.data('id')
                });
            });
        });
        $scope.chosenCategory.id = $el.data('id');
        $scope.chosenCategory.label = 'Category: ' + $el.text();
        $modal.hide();
    };

    /*
    * Show the thumbnail chooser
    */
    $scope.showPreviewImageChooser = function(e) {
        $modal.load('modal-preview-image-picker.html', true, $scope, undefined, { width: 910 });
    };

    /*
    * Move the previewIndex for the preview image choose
    */
    $scope.previewImageChosen = function() {

        var data = {
            time: $scope.previewImages[$scope.previewIndex].time
        };

        VideoService.setPreviewImage($scope.video.id, data);

        $timeout(function() {
            $scope.$apply(function(){
                $scope.chosenPreviewImage = $scope.previewImages[$scope.previewIndex].url;
                $modal.hide();
            });
        });
    };

    /*
    * Increment the previewIndex
    */
    $scope.previewImageNav = function(dir) {
        if ( dir === 'left' ) {
            if ( $scope.previewIndex === 0 ) {
                $scope.previewIndex = ($scope.previewImages.length-1);
            } else {
                $scope.previewIndex--;
            }
        } else {
            if ( $scope.previewIndex === ($scope.previewImages.length-1)) {
                $scope.previewIndex = 0;
            } else {
                $scope.previewIndex++;
            }
        }
    };

    /*
    * The user has selected a custom logo for their player via the file input
    */
    $scope.customLogoSelected = function($files) {

        var file = new FileReader();

        file.onload = function(e){
            console.log('file loaded', e);
            $timeout( function() {
                $scope.$apply(function() {
                    $scope.customLogo = {
                        data: e.target.result,
                        file: $files[0]
                    };
                });
            });

        };

        file.readAsDataURL($files[0]);
    };

    /*
    * Save the custom logo the user has chosen
    */
    $scope.saveCustomLogo = function() {
        VideoService.saveCustomLogo($scope.video.id, $scope.customLogo.file).then(function(response){
            console.log(response);
        });
    };

    /*
    * Toggle the display of the Click To More overlay
    */
    $scope.toggleClickToMore = function() {
        $timeout(function(){
            $scope.$apply(function(){
                $scope.showClickToMore = !$scope.showClickToMore;

                if ( $scope.showClickToMore === true ) {
                    $('#click-to-more-text input').focus();
                }
            });
        });
    };
}]);
