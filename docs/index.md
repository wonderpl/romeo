romeo web services
==================

[Account & user authentication](account.md)

[Video & tags](video.md)

[Analytics](analytics.md)

### Common Response Codes

Code | Description
:--- | :----------
200  | OK
201  | Used when a new resource has been created.  The response should include a `Location` header with the new resource url.
204  | Request was processed successfully but no content is being returned.
400  | There was an issue with the data (url query param or request body) passed to the server. See discussion below.
401  | The credentials in the `Cookie` header were invalid.
403  | The user has been authenticated but doesn't have access to this resource.
404  | Not found
405  | The method used (GET, POST, etc) isn't allowed for this resource.
500  | Something messed up on the server side. Worth retrying such requests.
503  | The backend service is down, hopefully temporarily. Try again.
504  | Timeout from backend service. Try again.

### Error Responses

There are two general formats to `400` error responses.

When sending a single piece of data the response json will include a single error message in the `message` field.

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "message": "Some error message goes here."
}
```

If the error response relates to form-like data then the response json will include a `form_errors` field,
which will  map form field names to a list of related error messages.

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "field1": [ "Error message #1.", "Error message #2." ],
  "field2": [ "Another error message." ]
 }
}
```

### Authentication

Currently based on session cookies. Ensure all api requests include the `Cookie` header
with the `session` cookie.

```http
GET /api/foo HTTP/1.1
Cookie: session=xxx
```

If the session cookie is not present the api will return a `401` response.

```http
HTTP/1.0 401 UNAUTHORIZED
Content-Type: application/json

{
 "error": "invalid_token"
}
```

If the token in the session cookie has expired or been invalidated then a `401` will
also be returned.

```http
HTTP/1.0 401 UNAUTHORIZED
Content-Type: application/json

{
 "error": "expired_token"
}
```
