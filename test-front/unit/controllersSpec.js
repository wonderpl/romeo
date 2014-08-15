'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var scope, controller;
  beforeEach(module('RomeoApp'));


  it('should have sign up controller', inject(function($controller) {
    var SignupCtrl = $controller('SignupCtrl', { $scope: {} });
    expect(SignupCtrl).toBeDefined();
  }));

  it('should have Login controller', inject(function($controller) {
    var LoginCtrl = $controller('LoginCtrl', { $scope: {} });
    expect(LoginCtrl).toBeDefined();
  }));

  // it('should have Twitter sign in controller', inject(function($controller) {
  //   var VideoCtrl = $controller('SigninCtrl', { $scope: {} });
  //   expect(VideoCtrl).toBeDefined();
  // }));

});