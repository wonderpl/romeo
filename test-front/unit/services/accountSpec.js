/* jshint ignore:start */

/* jasmine specs for services go here */

describe('services', function(){
	var services;
  beforeEach(module('RomeoApp'));

  beforeEach(inject(function($rootScope) {
     services = angular.module('RomeoApp.services');
  }));

  it('should have service module', function () {
  	expect(services).toBeDefined();
  });

});