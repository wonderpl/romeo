/* jshint ignore:start */

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var scope, controller;
  beforeEach(module('RomeoApp'));

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  afterEach(function () {
    controller = void(0); // Set to undefined
  });

  it('should have Analytics controller', inject(function($controller) {
    controller = $controller('AnalyticsCtrl', { $scope: scope, $element: angular.element('<div></div>') });
    expect(controller).toBeDefined();
  }));

  it('should have Login controller', inject(function($controller) {
    controller = $controller('LoginCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

  it('should have Main controller', inject(function($controller) {
    controller = $controller('MainCtrl', { $scope: scope, $element: angular.element('<div></div>') });
    expect(controller).toBeDefined();
  }));

  it('should have Organise controller', inject(function($controller, _$location_) {
    $location = _$location_;
    controller = $controller('OrganiseCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

  it('should have Profile controller', inject(function($controller) {
    controller = $controller('ProfileCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

  it('should have sign up controller', inject(function($controller) {
    controller = $controller('SignupCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

  it('should have twitter login controller', inject(function($controller) {
    controller = $controller('TwitterLoginCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

  it('should have Video controller', inject(function($controller) {
    controller = $controller('VideoCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

});