Authentication
==============

### Login

To log in `POST` to `/api/login` with the user's username or email and password.

```http
POST /api/login HTTP/1.1
Content-Type: application/json

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
  "description": "dolly profile description",
  "profile_cover": "http://path/to/dolly/profile/cover.jpg",
  "avatar": "http://path/to/dolly/avatar/image.jpg"
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
  "username": [ "The username or password you entered is incorrect." ]
 }
}
```

### Social Login/Registration

To log in with an OAuth token from Twitter `POST` to `/api/login/external` with the
token and the user's username/email address.

```http
POST /api/login/external HTTP/1.1
Content-Type: application/json

{
 "external_system": "twitter",
 "external_token": "xxx",
 "username": "user@system.com"
}
```

Property        | Required | Value                   | Description
:-------------- | :------- | :---------------------- | :----------
external_system | Yes      | `twitter`               | Specifies the social/oauth platform
external_token  | Yes      | The OAuth access token  | For Twitter, combine the key & secret with a `:`
username        | Yes      | Email address           | Email address used for login

On success the response will be the same as a login response, containing account and
user resource information.

On error, the `form_errors` property will describe the issue:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "external_system": [ "Not a valid choice." ],
  "external_token": [ "Invalid token." ],
  "username": [ "Username already registered." ]
 }
}
```

#### OAuth Flow

To retrieve a Twitter access token open a new browser window for the url
`/auth/twitter_redirect?callback=<callback_function>`.  On completion of the
Twitter OAuth flow `callback_function` will be called with a JSON object of
the form:

```json
{
 "error": null,
 "credentials": {
  "external_system": "twitter",
  "external_token": "key:secret",
  "metadata": {
   "screen_name": "foo"
  }
 }
}
```

### Token Validation

Collaborators without a username & password can be authenticated with a token.

```http
POST /api/validate_token HTTP/1.1
Content-Type: application/json

{
 "token": "xxx"
}
```

If the token is a valid "collaborator" token then a `200` will be returned with
the collaborator data and the session cookie will be updated to allow access to
the specified video.

```http
HTTP/1.1 200 OK
Set-Cookie: session=XXX
Content-Type: application/json

{
 "username": "Paul Egan",
 "avatar_url": "http://path/to/avatar/img.jpg",
 "video": {
  "href": "/api/video/28099975"
 },
 "permissions": [
  "can_download"
 ]
}
```

For other valid tokens a `204` will be returned with an updated session cookie.

```http
HTTP/1.1 204 NO CONTENT
Set-Cookie: session=XXX
```

If invalid a `400` with be returned.

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request"
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
 "description": "dolly profile description",
 "profile_cover": "http://path/to/dolly/profile/cover.jpg",
 "avatar": "http://path/to/dolly/avatar/image.jpg"
}
```

To change a property on the account record use the `PATCH` method.

```http
PATCH /api/account/<account_id> HTTP/1.1
Content-Type: application/json

{
 "display_name": "test"
}
```

For image properties like `profile_cover` and `avatar` a multipart body should be used,
with a part containing the appropriate file data.

```http
PATCH /api/account/<account_id> HTTP/1.1
Content-Type: multipart/form-data; boundary=---xxx

---xxx
Content-Disposition: form-data; name="avatar"; filename="img.png"
Content-Type: application/octet-stream

....PNG...
```

On success, the updated record is returned in the same format as for `GET`.

On error a `form_errors` property describes the issues per field.

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

```http
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
