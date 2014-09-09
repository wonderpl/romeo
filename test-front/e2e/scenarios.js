/* jshint ignore:start */

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function() {
  browser.get('/');

  it('should automatically redirect to /login when not logged in', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/app#/login");
  });

  it('should have a title of Romeo', function () {
    expect(browser.getTitle()).toEqual('Romeo');
  });

  describe('login', function() {
    beforeEach(function() {
      browser.get('/app#/login');
    });

    it('should render login when user navigates to /login', function() {
      var labels = element.all(by.css('.login-view__label'));
      expect(labels.first().getAttribute('for')).
         toBe('login-view__username');

    });

  });

  describe('sign up', function() {
    beforeEach(function() {
      browser.get('/app#/signup');
    });

    it('should render sign up view when user navigates to /signup', function() {
      expect(browser.getLocationAbsUrl()).toMatch("/app#/signup");
      expect(browser.getTitle()).toEqual('Romeo');
      var labels = element.all(by.css('.login-view__label'));
      expect(labels.get(0).getAttribute('for')).
         toBe('login-view__name');
      expect(labels.get(1).getAttribute('for')).
         toBe('login-view__username');
    });

  });
});
