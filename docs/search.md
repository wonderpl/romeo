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

To filter video results by an owning user use `src=video&q=owner_user:<user_id>` and for
videos that a user has collaborated on use `src=video&q=collaborator:<user_id>`.

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "video": {
  "total": 20,
  "items": [
   {
    "id": 17414644,
    "href": "/api/video/17414644?public",
    "title": "Video title",
    "thumbnail_url": "http://path/to/cover/thumbnail",
    "description": null,
    "duration": 60
   }
  ]
 },
 "content_owner": {
  "total": 10,
  "items": [
   {
    "id": 79687783,
    "href": "/api/user/79687783?public",
    "display_name": "The Juicery",
    "avatar": "http://path/to/avatar/img",
    "description": null
   }
  ]
 },
 "collaborator": {
  "total": 0,
  "items": [
  ]
 }
}
```
