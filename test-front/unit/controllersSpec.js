'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('RomeoApp.controllers'));


  it('should have video controller', inject(function($controller) {
    //spec body
    var VideoCtrl = $controller('VideoCtrl', { $scope: {} });
    expect(VideoCtrl).toBeDefined();
  }));

});