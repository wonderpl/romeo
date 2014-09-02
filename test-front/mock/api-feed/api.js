'use strict';

angular.module('mockedFeed').value('apiJSON', {
 validUser: {
   "account": {
    "href": "/api/account/123456",
    "account_type": "collaborator",
    "id": 123456,
    "name": "romeo account name"
   },
   "auth_status": "logged_in",
   "user": {
    "id": 1234567,
    "href": "/api/user/12334567",
    "username": "example@rockpack.com",
    "description": "dolly profile description",
    "display_name": "romeo account name",
    "contactable": true,
    "location": "GB",
    "search_keywords": null,
    "title": "Worker",
    "website_url": null,
    "profile_cover": "http://path/to/dolly/profile/cover.jpg",
    "avatar": "http://path/to/dolly/avatar/image.jpg"
   }
  }
});