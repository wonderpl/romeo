Auth
====

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
  "username": [ "mismatch" ]
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

If the token is valid a `204` will be returned with an updated session cookie.

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
