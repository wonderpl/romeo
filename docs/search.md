Search
======

To search across accounts & videos:

```http
GET /api/search?src=video&src=content_owner&src=collaborator&q=<query>&start=<i>&size=<n> HTTP/1.1
```

Parameter      | Required  | Value             | Description
:------------- | :-------- | :---------------- | :----------
q              | yes       | String            | Search query string.
location       | no        | Country code      | Filter results by location.
src            | no        | `video`, `content_owner`, `collaborator` | Data source.
start          | no        | 0-based integer   | Used for paging through the result items.
size           | no        | Result page size  | Number of items to return - max 50.


```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "video": {
  "total": 20,
  "items": [
   {"href": "/api/video/13", ...},
   {...}
  ]
 },
 "content_owner": {
  "total": 10,
  "items": [
   {"href": "/api/account/123", ...},
   {...}
 ]},
 "collaborator": {
  "total": 2,
  "items": [
   {"href": "/api/account/123", ...},
   {...}
 ]}
}
```
