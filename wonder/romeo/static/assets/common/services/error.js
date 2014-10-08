angular.module('RomeoApp.services')
  .factory('ErrorService', [function () {

  'use strict';

  function AuthError() {
      var tmp = Error.apply(this, arguments);
      tmp.name = this.name = 'AuthError';

      this.stack = tmp.stack;
      this.message = tmp.message;

      return this;
  }

  AuthError.prototype = Object.create(Error);

  return {
      AuthError: AuthError
  };
}]);