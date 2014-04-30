/*
* Main tests for the Upload page of RomeoApp
*/
describe("Upload tests", function() {
  describe("App Module:", function() {

    var module;
    beforeEach(function() {
      module = angular.module("RomeoApp");
    });

    it("should be registered", function() {
      expect(module).not.toBe(null);
    });

  });
});