/* jshint ignore:start */

describe('Search Controller', function() {

  var scope, $httpBackend, ctrl;
  var results;
  beforeEach(module('RomeoApp', 'mockedSearchResults'));

  beforeEach(inject(function($rootScope, $controller, $injector, $location, searchResults) {
    scope = $rootScope.$new();
    scope.search = {};
    $httpBackend = $injector.get('$httpBackend');
    results = searchResults.results;
    ctrl = $controller('SearchCtrl', {
      '$scope': scope
    });
  }));

  afterEach(function() {
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