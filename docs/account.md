Auth
====

### Login

To log in `POST` to `/api/login` with the user's username or email and password.

```http
POST /api/login HTTP/1.1

{
 "username": "paulegan@rockpack.com",
 "password": "changeme"
}
```

On success the response body includes both user & account data:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session=XXX

{
 "account": {
  "href": "/api/account/27250600",
  "name": "romeo account name",
  "display_name": "dolly user name",
  "profile_cover": "http://path/to/dolly/profile/cover.jpg",
  "avatar": "http://path/to/dolly/avatar/image.jpg",
  "player_logo": null
 },
 "user": {
  "href": "/api/user/56945137",
  "username": "paulegan@rockpack.com"
 }
}
```

If the username or password do not match the records in the database then a `400` will
be returned.

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "username": [ "mismatch" ]
 }
}
```

Account
=======

### Account

Get details for the romeo account.

```http
GET /api/account/<account_id> HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "href": "/api/account/27250600",
 "name": "romeo account name",
 "display_name": "dolly user name",
 "profile_cover": "http://path/to/dolly/profile/cover.jpg",
 "avatar": "http://path/to/dolly/avatar/image.jpg",
 "player_logo": null
}
```

To change a property on the account record use the `PATCH` method.

```http
PATCH /api/account/<account_id> HTTP/1.1

{
 "display_name": "test"
}
```

On success:

```http
HTTP/1.1 204 NO CONTENT
```

On error:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "display_name": [ "Too long." ]
 }
}
```

### User

Get details for a specific account user.

```
GET /api/user/<user_id> HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "href": "/api/user/56945137",
 "username": "paulegan@rockpack.com"
}
```
