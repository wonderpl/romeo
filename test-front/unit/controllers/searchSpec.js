/* jshint ignore:start */

describe('Search Controller', function() {

  var scope, $httpBackend, ctrl;
  var results;
  beforeEach(module('RomeoApp', 'mockedObject', 'mockedFeed'));

  beforeEach(inject(function($rootScope, $controller, $injector, $location, searchResults, apiJSON) {
    scope = $rootScope.$new();
    scope.search = {};
    $httpBackend = $injector.get('$httpBackend');
    authRequestHandler = $httpBackend.when('GET', '/api').respond(200, apiJSON.validUser);
    results = searchResults.results;
    ctrl = $controller('SearchCtrl', {
      '$scope': scope
    });
  }));

  afterEach(function() {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Initialise', function() {

    it('should have no search results', function() {
      expect(scope.search.results).not.toBeDefined();
    });

    it('should have no search criteria', function () {
      expect(scope.search.expression).not.toBeDefined();
    });
  });

});