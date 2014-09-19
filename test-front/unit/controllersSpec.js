/* jshint ignore:start */

/* jasmine specs for controllers go here */

describe('controllers', function () {
  var scope, controller;
  beforeEach(module('RomeoApp'));

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  afterEach(function () {
    controller = void(0); // Set to undefined
  });

  describe('account', function () {
    it('should have Email sign up controller', inject(function ($controller) {
      controller = $controller('SignupCtrl', { $scope: scope });
      expect(controller).toBeDefined();
    }));

    it('should have Login controller', inject(function ($controller) {
      controller = $controller('LoginCtrl', { $scope: scope });
      expect(controller).toBeDefined();
    }));

    it('should have Twitter signup controller', inject(function ($controller) {
      controller = $controller('TwitterLoginCtrl', { $scope: scope });
      expect(controller).toBeDefined();
    }));

    it('should have Upgrade controller', inject(function ($controller) {
      controller = $controller('UpgradeCtrl', { $scope: scope });
      expect(controller).toBeDefined();
    }));
  });

  it('should have Analytics controller', inject(function ($controller) {
    controller = $controller('AnalyticsCtrl', { $scope: scope, $element: angular.element('<div></div>') });
    expect(controller).toBeDefined();
  }));

  it('should have Organise controller', inject(function ($controller, _$location_) {
    $location = _$location_;
    controller = $controller('OrganiseCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

  it('should have Pages controller', inject(function ($controller) {
    controller = $controller('StaticPagesCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

  describe('profile', function () {
    it('should have Profile controller', inject(function ($controller) {
      controller = $controller('ProfileCtrl', { $scope: scope });
      expect(controller).toBeDefined();
    }));

    it('should have Public profile controller', inject(function ($controller) {
      controller = $controller('ProfilePublicCtrl', { $scope: scope });
      expect(controller).toBeDefined();
    }));

    it('should have Edit profile controller', inject(function ($controller) {
      controller = $controller('ProfileEditCtrl', { $scope: scope });
      expect(controller).toBeDefined();
    }));
  });

  it('should have Publish video controller', inject(function ($controller) {
    controller = $controller('PublishCtrl', { $scope: scope, video: {} });
    expect(controller).toBeDefined();
  }));

  it('should have Search controller', inject(function ($controller) {
    controller = $controller('SearchCtrl', { $scope: scope, $element: angular.element('<div></div>') });
    expect(controller).toBeDefined();
  }));

  it('should have Video controller', inject(function ($controller) {
    controller = $controller('VideoCtrl', { $scope: scope });
    expect(controller).toBeDefined();
  }));

});