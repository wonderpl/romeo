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
  "id": 27250600,
  "href": "/api/account/27250600",
  "account_type": "collaborator",
  "name": "romeo account name",
  "display_name": "dolly user name",
  "description": "dolly profile description",
  "profile_cover": "http://path/to/dolly/profile/cover.jpg",
  "avatar": "http://path/to/dolly/avatar/image.jpg"
 },
 "user": {
  "id": 56945137,
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

### Registration

To create a new account using a username & password, `POST` to `/api/register`:

```http
POST /api/register HTTP/1.1
Content-Type: application/json

{
 "username": "user@email.com",
 "password": "xxx",
 "display_name": "display name",
 "location": "GB"
}
```

On success the response will be the same as a login response.

On error, the `form_errors` property will describe the issue:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "username": [ "Username already registered." ],
  "password": [ "Field must be at least 8 characters long." ],
  "display_name": [ "This field is required." ],
  "location": [ "Not a valid choice" ]
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
 "username": "user@system.com",
 "location": "GB"
}
```

Property        | Required | Value                   | Description
:-------------- | :------- | :---------------------- | :----------
external_system | Yes      | `twitter`               | Specifies the social/oauth platform
external_token  | Yes      | The OAuth access token  | For Twitter, combine the key & secret with a `:`
username        | No       | Email address           | Sets username when registering
location        | No       | 2-letter country code   | The user's location

On success the response will be the same as a login response, containing account and
user resource information.

If registration is required and a username is not provided then a `registration_required`
error will be returned:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "registration_required",
 "form_errors": {
  "username": [ "This field is required." ]
 }
}
```

On registration error, the `form_errors` property will describe the issue:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "external_system": [ "Not a valid choice." ],
  "external_token": [ "Invalid token." ],
  "username": [ "Username already registered." ],
  "location": [ "This field is required." ]
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
 "id": 27250600,
 "href": "/api/account/27250600",
 "account_type": "collaborator",
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

### Content Upload

To upload a video or image file directly to S3 for an account you must first request upload
arguments which provide a target URL and access key & signature field values.

```http
GET /api/account/<account_id>/upload_args?type=<file_type> HTTP/1.1
```

Parameter | Required | Value                                | Description
:-------- | :------- | :----------------------------------- | :----------
type      | No       | `video`, `avatar` or `profile_cover` | Specifies the upload file type, defaults to `video`

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "action": "http://media.dev.wonderpl.com.s3.amazonaws.com/",
 "fields": [
  {
   "name": "key",
   "value": "path/to/file"
  },
  {
   "name": "policy",
   "value": "xxx"
  },
  {
   "name": "AWSAccessKeyId",
   "value": "xxx"
  },
  {
   "name": "signature",
   "value": "xxx"
  }
 ]
}
```

Use the provided field names & values with multipart `POST` to the specified `action` URL.
See the [S3 documentation](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTForms.html) for further detail.

### User

Get details for a specific account user.

```http
GET /api/user/<user_id> HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "id": 56945137,
 "href": "/api/user/56945137",
 "username": "paulegan@rockpack.com",
 "location": "GB",
 "display_name": "name for display",
 "title": "job/role/industry",
 "description": "profile description",
 "website_url": "http://company.com",
 "search_keywords": "some,comma separated,keywords",
 "profile_cover": "http://path/to/profile/cover.jpg",
 "avatar": "http://path/to/avatar/image.jpg",
 "contactable": true
}
```

To change one or more properties use a `PATCH` request with the required changes.

```http
PATCH /api/user/<user_id> HTTP/1.1
Content-Type: application/json

{
 "title": "Secret Agent",
 "contactable": false
}
```

For the `profile_cover` and `avatar` images you can first use the `upload_args` service,
upload the content to S3, and then specify the new filename in the JSON `PATCH` request.
Alternatively you can use a multipart `PATCH` request to send the image data directly to
the server.

```http
PATCH /api/user/<user_id> HTTP/1.1
Content-Type: multipart/form-data; boundary=---xxx

---xxx
Content-Disposition: form-data; name="avatar"; filename="img.png"
Content-Type: application/octet-stream

....PNG...
```

On success the updated resource record will be returned and on error a `form_errors` object
will detail the issue.

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "location": [ "Not a valid choice" ],
  "website_url": [ "Invalid URL." ],
  "avatar": [ "Path not found." ]
 }
}
```

### User Connections

To request a new connection `POST` the target user id to current user's connections resource.
If no connection exists then the state will be set to `pending` and a confirmation email will
be sent to the target user. If the reverse connection already exists then the state will be
set to `accepted` and both users will receive an acceptance email.

```http
POST /api/user/<user_id>/connections HTTP/1.1
Content-Type: application/json

{
 "user": 97220269,
 "message": "Optional message."
}
```

For a new connection a `201` is returned but if it already exists it'll be a `204`.

```http
HTTP/1.1 201 CREATED
Location: /api/user/66792515/connections/97220269
Content-Type: application/json

{
 "id": 97220269,
 "href": "/api/user/66792515/connections/97220269"
}
```

On error the `form_errors` property will describe the issue:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "user": [ "User not contactable." ]
 }
}
```

To retrieve a list of user connections including collaborators, accepted & pending
connections:

```http
GET /api/user/<user_id>/connections HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "connection": {
  "total": 2,
  "items": [
   {
    "id": 42,
    "href": "/api/user/45567553/connections/42",
    "state": "pending",
    "user": {
     "id": 123,
     "href": /api/user/123,
     "display_name": "name",
     "title": null,
     "email": null,
     "avatar": null
    }
   },
   {
    "id": null,
    "href": null,
    "state": "collaborator",
    "user": {
     "id": 80036952,
     "href": "/api/user/80036952",
     "display_name": "Collaborator with account",
     "title": null,
     "avatar": "http://path/to/avatar/img",
     "email": "noreply@rockpack.com"
    }
   },
   {
    "id": null,
    "href": null,
    "state": "collaborator",
    "collaborator": {
     "id": 3,
     "href": "/api/video/40718477/collaborators/3",
     "display_name": "Collaborator without account",
     "avatar": "http://gravatar.com/avatar/xxx",
     "email": "noreply@wonderpl.com"
    }
   }
  ]
 }
}
```

### Payment

Accounts of type `collaborator` cannot upload or copy videos. These services will
return a `403` in this case.

To upgrade from `collaborator` to a `content_owner` account payment is required.
Initiate the payment process using [Stripe's API](https://stripe.com/docs/tutorials/checkout)
and `POST` the `stripeToken` to the payment sub-resource.

```http
POST /api/account/<account_id>/payment HTTP/1.1
Content-Type: application/json

{"stripeToken": "xxx"}
```

### Locations

To retrieve a list of locations for use with the account services:

```http
GET /api/locations HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "country": {
  "total": 250,
  "items": [
   {
    "code": "AD",
    "name": "Andorra"
   },
   {
    "code": "ZW",
    "name": "Zimbabwe"
   }
  ]
 }
}
```

## User Title Suggestions

Use the `/api/user_titles` service to get a list of suggested terms for the user `title` property.

```http
GET /api/user_titles?prefix=<prefix>&start=<i>&size=<n> HTTP/1.1
```

Parameter      | Required  | Value             | Description
:------------- | :-------- | :---------------- | :----------
prefix         | yes       | String            | Prefix text to match.
start          | no        | 0-based integer   | Used for paging through the result items.
size           | no        | Result page size  | Number of items to return - max 50.


```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "user_title": {
  "total": 1,
  "items": [
   "Test"
  ]
 }
}
```

## Register Interest

To register a user's interest in joining the beta program or request an invite `POST`
to `invite_request`.

```http
POST /api/invite_request
Content-Type: application/json

{
 "email": "user@server.com",
 "name": "User Name",
 "message": "some text"
}
```

## Public profile visit tracking

To find users that has visit your profile recently (last 7 days) you `GET` from `visit` on your own user account

```http
GET /api/user/<user_id>/visit HTTP/1.1
Content-Type: application/json

{
 "visit": {
    "total": 2,
    "items": [
      {
        "id": 123,
        "href": "/api/user/123",
        "display_name": "name",
        "title": null,
        "avatar": null
      },
      {
        "id": 80036952,
        "href": "/api/user/80036952",
        "display_name": "Collaborator with account",
        "title": null,
        "avatar": "http://path/to/avatar/img"
      }
    ]
  }
}
```


To track a visit to a public profile, so we can send out notifications and show on the site who has viewed your profile you `POST`
to `visit` on your own user account

```http
POST /api/user/<user_id>/visit HTTP/1.1
Content-Type: application/json

{
 "profile": "<public_profile_user_id>"
}
```

