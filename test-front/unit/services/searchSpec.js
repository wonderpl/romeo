/* jshint ignore:start */

/* jasmine specs for services go here */

describe('Search Service', function(){

  var searchService;

  beforeEach(module('RomeoApp'));

  it('should update the url querystring when a search is made', function () {
    inject(function(SearchService, $location) {
      searchService = SearchService;
      var expression = { q : 'test' };
      searchService.search(expression);
      expect($location.search()).toEqual({ q : 'test' });
    });
  });

  it('should update the url querystring when a search is made using a querystring as the expression', function () {
    inject(function(SearchService, $location) {
      searchService = SearchService;
      var expression = 'q=test';
      searchService.search(expression);
      expect($location.search()).toEqual({ q : 'test' });
    });
  });

  it('should remove the url querystring when a search expression is blank', function () {
    inject(function(SearchService, $location) {
      searchService = SearchService;
      searchService.search('');
      expect($location.search()).toEqual({});
    });
  });

  it('should remove the url querystring when a search expression is not given at all', function () {
    inject(function(SearchService, $location) {
      searchService = SearchService;
      searchService.search();
      expect($location.search()).toEqual({});
    });
  });

});