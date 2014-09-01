/* jshint ignore:start */

/* jasmine specs for services go here */

describe('services', function(){
	//var scope, controller;
	var services;
  beforeEach(module('RomeoApp'));

  beforeEach(inject(function($rootScope) {
     services = angular.module('RomeoApp.services');
  }));

  // afterEach(function () {
  //   controller = void(0); // Set to undefined
  // });

  it('should have service module', function () {
  	expect(services).toBeDefined();
  });

  it('should have account service', inject(function(AccountService) {
  	expect(AccountService).toBeDefined();
  	expect(AccountService.getAccount).toBeDefined();
  }));

  it('should have auth service', inject(function(AuthService) {
  	expect(AuthService).toBeDefined();
  	expect(AuthService.login).toBeDefined();
  }));

  it('should have collaborators service', inject(function(CollaboratorsService) {
  	expect(CollaboratorsService).toBeDefined();
  	expect(CollaboratorsService.addCollaborator).toBeDefined();
  }));

  it('should have comments service', inject(function(CommentsService) {
  	expect(CommentsService).toBeDefined();
  	expect(CommentsService.resolveComment).toBeDefined();
  }));

  it('should have modal service', inject(function(modal) {
  	expect(modal).toBeDefined();
  	expect(modal.show).toBeDefined();
  }));

  it('should have search service', inject(function(SearchService) {
  	expect(SearchService).toBeDefined();
  	expect(SearchService.search).toBeDefined();
  }));

  it('should have stats service', inject(function(StatsService) {
  	expect(StatsService).toBeDefined();
  	expect(StatsService.getOne).toBeDefined();
  }));

  it('should have analytics fields service', inject(function(AnalyticsFields) {
  	expect(AnalyticsFields).toBeDefined();
  }));

  it('should have overview service', inject(function(OverviewService) {
  	expect(OverviewService).toBeDefined();
  	expect(OverviewService.get).toBeDefined();
  }));

  it('should have performance service', inject(function(PerformanceService) {
  	expect(PerformanceService).toBeDefined();
  	expect(PerformanceService.get).toBeDefined();
  }));

  it('should have geographic service', inject(function(GeographicService) {
  	expect(GeographicService).toBeDefined();
  	expect(GeographicService.get).toBeDefined();
  }));

  it('should have engagement service', inject(function(EngagementService) {
  	expect(EngagementService).toBeDefined();
  	expect(EngagementService.get).toBeDefined();
  }));
});