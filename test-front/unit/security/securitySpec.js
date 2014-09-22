/* jshint ignore:start */

/* jasmine specs for services go here */

describe('security', function(){
  var services, service;
  var $location;
  beforeEach(module('RomeoApp'));

  beforeEach(inject(function(_$location_, _$q_, _AccountService_, SecurityService) {
      service = SecurityService;
  }));

  beforeEach(inject(function($rootScope) {
     services = angular.module('RomeoApp.security');
  }));

  it('should have security module', function () {
  	expect(services).toBeDefined();
  });

  describe('is methods', function () {
    it('should return false for isAuthenticated when not logged in', function () {
        expect(service.isAuthenticated).toBeDefined();
        expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should return false for isCollaborator when not logged in', function () {
        expect(service.isCollaborator).toBeDefined();
        expect(service.isCollaborator()).toBeFalsy();
    });

    it('should return false for isContentOwner when not logged in', function () {
        expect(service.isContentOwner).toBeDefined();
        expect(service.isContentOwner()).toBeFalsy();
    });

    it('should return false for isProfileComplete when not logged in', function () {
        expect(service.isProfileComplete).toBeDefined();
        expect(service.isProfileComplete()).toBeFalsy();
    });
  });


  it('should return null for getUser when not logged in', function () {
      expect(service.getUser).toBeDefined();
      expect(service.getUser()).toBeNull();
  });
});