/* jshint ignore:start */

/* jasmine specs for signup go here */

describe('Sign up', function(){
  var scope, httpBackend, ctrl;
  var user;
  beforeEach(module('RomeoApp', 'mockedObject', 'mockedFeed'));

  describe('Validate form data', function() {
    beforeEach(inject(function($rootScope, $controller, userJSON) {
      scope = {};
      user = userJSON.validUser; // Mocked from from test-front/mock/defaultUserObject.js

      ctrl =  $controller('SignupCtrl', {
        '$scope': scope
      });
    }));

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

  describe('Register web service call', function() {
    beforeEach(inject(function($rootScope, $httpBackend, $controller, userJSON, registerJSON) {
      httpBackend = $httpBackend;
      scope = {};
      user = userJSON.validUser; // Mocked from from test-front/mock/defaultUserObject.js

      // Get mocked register api JSON 
      // from test-front/mock/api-feed/register.js
      // on POST to web service
      $httpBackend.when('POST','api/register').respond(registerJSON);

      ctrl =  $controller('SignupCtrl', {
        '$scope': scope
      });
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should have signUp method', function() {
      expect(scope).toBeDefined();

      expect(scope.signUp).toBeDefined();
    });

    it('should set is loading to true when sign up is called', function() {
      expect(scope.isLoading).toBe(false);
      scope.signUp();
      expect(scope.isLoading).toBe(true);
    });
  });
});