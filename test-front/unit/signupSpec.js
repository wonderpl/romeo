'use strict';

/* jasmine specs for signup go here */

describe('Sign up', function(){
  var scope, httpBackend, ctrl;
  beforeEach(module('RomeoApp'));

  beforeEach(inject(function($rootScope, $httpBackend, $controller) {
    httpBackend = $httpBackend;
    scope = $rootScope.$new();

    ctrl =  $controller('SignupCtrl', {
      '$scope': scope
    });
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have good defaults', function() {
    expect(scope).toBeDefined();
    expect(scope.username).toBe('');
    expect(scope.password).toBe('');
    expect(scope.name).toBe('');
    expect(scope.location).toEqual('GB');
    expect(scope.location).toNotEqual('US');
    expect(scope.tandc).toBe(false);
    expect(scope.tandc).toNotBe('');
  });

  // it('should have Login controller', inject(function($controller) {
  //   var LoginCtrl = $controller('LoginCtrl', { $scope: {} });
  //   expect(LoginCtrl).toBeDefined();
  // }));

});