'use strict';

angular.module('mockedObject', []).value('userJSON', {
	validUser: {
		email: 'example@example.com',
		name: 'John Doe',
		password: 'password123'
	}
});