'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var scope, controller;
  beforeEach(module('RomeoApp'));

  afterEach(function () {
    controller = void(0); // Set to undefined
  });

  it('should have Analytics controller', inject(function($controller) {
    controller = $controller('AnalyticsCtrl', { $scope: {}, $element: angular.element('<div></div>') });
    expect(controller).toBeDefined();
  }));

  it('should have Login controller', inject(function($controller) {
    controller = $controller('LoginCtrl', { $scope: {} });
    expect(controller).toBeDefined();
  }));

  it('should have Main controller', inject(function($rootScope, $controller) {
    controller = $controller('MainCtrl', { $scope: $rootScope.$new(), $element: angular.element('<div></div>') });
    expect(controller).toBeDefined();
  }));

  // // @TODO: Need investigation
  // it('should have Organise controller', inject(function($controller, _$location_) {
  //   $location = _$location_;
  //   controller = $controller('OrganiseCtrl', { $scope: {} });
  //   expect(controller).toBeDefined();
  // }));

  // // @TODO: Need investigation
  // it('should have Profile controller', inject(function($controller) {
  //   controller = $controller('ProfileCtrl', { $scope: {} });
  //   expect(controller).toBeDefined();
  // }));

  it('should have sign up controller', inject(function($controller) {
    controller = $controller('SignupCtrl', { $scope: {} });
    expect(controller).toBeDefined();
  }));

  // // @TODO: Need investigation
  // it('should have Video controller', inject(function($controller) {
  //   controller = $controller('VideoCtrl', { $scope: {} });
  //   expect(controller).toBeDefined();
  // }));

});