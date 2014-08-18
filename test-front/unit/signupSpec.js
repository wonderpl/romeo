/* jshint ignore:start */

/* jasmine specs for signup go here */

describe('Sign up', function(){
  var scope, httpBackend, ctrl;
  var user =  { email: 'example@example.com', name: 'John Doe', password: 'password123' };
  beforeEach(module('RomeoApp'));

  beforeEach(inject(function($rootScope, $httpBackend, $controller) {
    //httpBackend = $httpBackend;
    scope = {}; //$rootScope.$new();

    ctrl =  $controller('SignupCtrl', {
      '$scope': scope
    });
  }));

  // afterEach(function() {
  //   httpBackend.verifyNoOutstandingExpectation();
  //   httpBackend.verifyNoOutstandingRequest();
  // });

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

  it('should have validation error (name required) if form is empty', function() {
    expect(scope).toBeDefined();
    expect(scope.username).toBe('');
    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Name required');
  });

  it('should have validation error (email required) if only name is set', function() {
    expect(scope).toBeDefined();

    expect(scope.name).toBe('');
    scope.name = user.name;
    expect(scope.name).toBe(user.name);

    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Email required');
  });

  it('should have validation error (email required) if username isn\'t a valid email address', function() {
    expect(scope).toBeDefined();

    expect(scope.name).toBe('');
    scope.name = user.name;
    expect(scope.name).toBe(user.name);

    expect(scope.username).toBe('');
    scope.username = user.name;
    expect(scope.username).toBe(user.name);
    
    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Email required');
  });

  it('should have validation error (password required) if only name and username is set', function() {
    expect(scope).toBeDefined();

    expect(scope.name).toBe('');
    scope.name = user.name;
    expect(scope.name).toBe(user.name);

    expect(scope.username).toBe('');
    scope.username = user.email;
    expect(scope.username).toBe(user.email);

    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Password required');
  });

  it('should have validation error (name required) if name isn\'t set', function() {
    expect(scope).toBeDefined();

    expect(scope.username).toBe('');
    scope.username = user.email;
    expect(scope.username).toBe(user.email);

    expect(scope.password).toBe('');
    scope.password = user.password;
    expect(scope.password).toBe(user.password);

    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('Name required');
  });

  it('should have validation error (terms and condition) if T & C not set', function() {
    expect(scope).toBeDefined();

    expect(scope.username).toBe('');
    scope.username = user.email;
    expect(scope.username).toBe(user.email);

    expect(scope.password).toBe('');
    scope.password = user.password;
    expect(scope.password).toBe(user.password);

    expect(scope.name).toBe('');
    scope.name = user.name;
    expect(scope.name).toBe(user.name);

    expect(scope.validate()).toBe(false);
    expect(scope.errorMessage).toEqual('You have to agree to the Terms and Conditions');
  });

  it('should validate if form has valid data', function() {
    expect(scope).toBeDefined();

    expect(scope.username).toBe('');
    scope.username = user.email;
    expect(scope.username).toBe(user.email);

    expect(scope.password).toBe('');
    scope.password = user.password;
    expect(scope.password).toBe(user.password);

    expect(scope.name).toBe('');
    scope.name = user.name;
    expect(scope.name).toBe(user.name);

    expect(scope.tandc).toBe(false);
    scope.tandc = true;
    expect(scope.tandc).toBe(true);

    expect(scope.validate()).toBe(true);
    expect(scope.errorMessage).toBeUndefined();
  });

});