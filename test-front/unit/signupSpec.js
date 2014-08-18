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

  it('should have validation error if form is empty', function() {
    expect(scope).toBeDefined();
    expect(scope.username).toBe('');
    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Email required');
  });

  it('should have validation error if only username is set', function() {
    var email = 'example@example.com';
    expect(scope).toBeDefined();
    expect(scope.username).toBe('');
    scope.username = email;
    expect(scope.username).toBe(email);
    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Password required');
  });

  it('should have validation error if name isn\'t set', function() {
    var email = 'example@example.com';
    var password = 'password123';
    expect(scope).toBeDefined();

    expect(scope.username).toBe('');
    scope.username = email;
    expect(scope.username).toBe(email);

    expect(scope.password).toBe('');
    scope.password = password;
    expect(scope.password).toBe(password);

    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Name required');
  });

  // it('should have Login controller', inject(function($controller) {
  //   var LoginCtrl = $controller('LoginCtrl', { $scope: {} });
  //   expect(LoginCtrl).toBeDefined();
  // }));

});