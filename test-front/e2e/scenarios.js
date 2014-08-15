'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function() {

  browser.get('/');

  it('should automatically redirect to /login when not logged in', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/app#/login");
  });


  describe('login', function() {

    beforeEach(function() {
      browser.get('/app#/login');
    });


    it('should render login when user navigates to /login', function() {
      expect(element.all(by.css('.login-view legend')).first().getText()).
        toMatch(/Log in details/);
    });

  });


  describe('sign up', function() {

    beforeEach(function() {
      browser.get('/app#/signup');
    });


    it('should render sign up view when user navigates to /signup', function() {
      expect(element.all(by.css('.login-view legend')).first().getText()).
        toMatch(/Sign up details/);
    });

  });
});
