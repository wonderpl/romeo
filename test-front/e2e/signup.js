// jshint ignore:start

// https://github.com/angular/protractor/blob/master/docs/getting-started.md

describe('Romeo signup', function() {
  var RomeoSignupPage = function() {
    this.nameInput = element(by.model('name'));
    this.usernameInput = element(by.model('username'));
    this.passwordInput = element(by.model('password'));
    this.tandcCheckbox = element(by.model('tandc'));
    this.locationSelect = element(by.model('location'));
    this.submitButton = element(by.partialButtonText('Sign up'));
    this.errors = element(by.binding('errorMessage'));

    this.get = function() {
      browser.get('/app#/signup');
    };

    this.setName = function(name) {
      this.nameInput.sendKeys(name);
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
    this.setLocation = function(location) {
      this.locationSelect.sendKeys(location);
    };
  }

  var page;
  beforeEach(function() {
    page = new RomeoSignupPage();
    page.get();
  });

  it('should have a disabled sign up button', function () {
    expect(page.submitButton.getAttribute('class')).toContain('btn--disabled');
  });

  it('should enable login button when checking Terms and Conditions', function () {
    expect(page.submitButton.getAttribute('class')).toContain('btn--disabled');

    page.setTAndC();

    expect(page.submitButton.getAttribute('class')).toNotContain('btn--disabled');
  });

  it('should show error message if name missing', function () {
    page.setUsername('example@example.com');
    page.setPassword('abc12345678');
    page.setTAndC();

    page.submitButton.click();
    expect(page.errors.getText()).toContain('Name required');
  });

  it('should show error message if email missing', function () {
    page.setName('John Doe');
    page.setPassword('abc12345678');
    page.setTAndC();

    page.submitButton.click();
    expect(page.errors.getText()).toContain('Email required');
  });

  it('should show error message if invalid email', function () {
    page.setName('John Doe');
    page.setUsername('example');
    page.setPassword('abc12345678');
    page.setTAndC();

    page.submitButton.click();
    expect(page.errors.getText()).toContain('Invalid email');
  });

  it('should show error message if invalid password', function () {
    page.setName('John Doe');
    page.setUsername('example@example.com');
    page.setPassword('123');
    page.setTAndC();

    page.submitButton.click();
    expect(page.errors.getText()).toBe('Password must be at least 8 characters long.');
  });

  it('should redirect to profile when valid sign up', function () {
    var randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12);
    var username = 'noreply+e2etest-' + randomStr + '@wonderpl.com';
    page.setName('John Doe');
    page.setUsername(username);
    page.setPassword('romeo123');
    page.setLocation('FR');
    page.setTAndC();

    console.log('Creating account: ', username);

    page.submitButton.click();
    expect(browser.getLocationAbsUrl()).toMatch("/app#/settings/import");
  });
});
