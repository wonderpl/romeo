// jshint ignore:start

// https://github.com/angular/protractor/blob/master/docs/getting-started.md

describe('Romeo login', function() {
  var RomeoLoginPage = function() {
    this.usernameInput = element(by.model('username'));
    this.passwordInput = element(by.model('password'));
    this.tandcCheckbox = element(by.model('tandc'));
    this.submitButton = element(by.partialButtonText('Login'));
    this.errors = element(by.binding('errors'));

    this.get = function() {
      browser.get('/app#/login');
    };

    this.setUsername = function(name) {
      this.usernameInput.sendKeys(name);
    };
    this.setPassword = function(password) {
      this.passwordInput.sendKeys(password);
    };
    this.setTAndC = function(password) {
      this.tandcCheckbox.click();
    };
  }
  it('should automatically redirect to /login when not logged in', function() {
    browser.get('/app');
    expect(browser.getLocationAbsUrl()).toMatch("/app#/login");
  });

  describe('login', function() {
    var page;
    beforeEach(function() {
      page = new RomeoLoginPage();
      page.get();
    });

    it('should render login when user navigates to /login', function() {
      var labels = element.all(by.css('.login-view__label'));
      expect(labels.first().getAttribute('for')).
         toBe('login-view__username');
    });

    it('should have a disabled login button', function () {
      expect(page.submitButton.getAttribute('class')).toContain('btn--disabled');
    });

    it('should enable login button when checking Terms and Conditions', function () {
      expect(page.submitButton.getAttribute('class')).toContain('btn--disabled');

      page.setTAndC();

      expect(page.submitButton.getAttribute('class')).toNotContain('btn--disabled');
    });

    it('should show error message if invalid email', function () {
      page.setUsername('example');
      page.setPassword('abc12345678');
      page.setTAndC();

      page.submitButton.click();
      expect(page.errors.getText()).toContain('Invalid email');
    });

    it('should show error message if invalid password', function () {
      page.setUsername('example@example.com');
      page.setPassword('123');
      page.setTAndC();

      page.submitButton.click();
      expect(page.errors.getText()).toBe('Invalid email or password');
    });

    // Using Lynn Blades account for login testing, see:
    // https://gist.github.com/paulegan/17393427db79edc7e540

    it('should redirect to organise with valid credentials', function () {
      page.setUsername('noreply+98686185@wonderpl.com');
      page.setPassword('romeo');
      page.setTAndC();

      page.submitButton.click();
      expect(browser.getLocationAbsUrl()).toMatch("/app#/organise");
    });

  });
});
