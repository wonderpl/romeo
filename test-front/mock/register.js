'use strict';

angular.module('mockedFeed', []).value('registerJSON', {
 "account": {
  "href": "/api/account/27250600",
  "account_type": "collaborator",
  "name": "romeo account name",
  "display_name": "dolly user name",
  "description": "dolly profile description",
  "profile_cover": "http://path/to/dolly/profile/cover.jpg",
  "avatar": "http://path/to/dolly/avatar/image.jpg"
 },
 "user": {
  "href": "/api/user/56945137",
  "username": "example@rockpack.com"
 }
});