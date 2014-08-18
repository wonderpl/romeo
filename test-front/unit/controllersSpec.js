'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var scope, controller;
  beforeEach(module('RomeoApp'));

  afterEach(function () {
    controller = void(0); // Set to undefined
  });

  it('should have sign up controller', inject(function($controller) {
    controller = $controller('SignupCtrl', { $scope: {} });
    expect(controller).toBeDefined();
  }));

  it('should have Login controller', inject(function($controller) {
    controller = $controller('LoginCtrl', { $scope: {} });
    expect(controller).toBeDefined();
  }));

  it('should have Twitter sign in controller', inject(function($controller) {
    //controller = $controller('SigninCtrl', { $scope: {} });
    expect(controller).toBeDefined();
  }));

});