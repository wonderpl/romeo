Video
=====

### Video List

To get a list of all videos associated with an account:

```http
GET /api/account/<account_id>/videos HTTP/1.1
```

Return a list of video records:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "video": {
  "total": 1,
  "items": [
   {
    "id": 34489679,
    "href": "/api/video/34489679",
    "date_added": "2014-03-27 13:49:19",
    "date_updated": "2014-03-28 15:58:04",
    "status": "processing",
    "title": "test",
    "description": "test desc",
    "category": null,
    "duration": 600
   }
  ]
 }
}
```

### Create

To create a new video `POST` to the account videos resource with the desired
properties.

```http
POST /api/account/<account_id>/videos HTTP/1.1
Content-Type: application/json

{
 "title": "test"
}
```

Property       | Required? | Value               | Description
:------------- | :-------- | :------------------ | :----------
title          | yes       | string (max 256)    | The video title
description    | no        | string (max 256)    | Video description text
category       | no        | Category ID         | Identifier from /api/categories
filename       | no        | string              | Path to video file on S3

On success the service will return a `201` with the video id & resource url:

```http
HTTP/1.1 201 CREATED
Location: https://romeo.wonderl.com/api/video/76804765
Content-Type: application/json

{
 "id": 76804765,
 "href": "/api/video/76804765"
}
```

A `400` will be returned on error:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "category": ["Not a valid choice"]
 }
}
```

### Video Item

#### Get a video record

```http
GET /api/video/3 HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "category": null, 
    "date_added": "2014-03-18 14:11:59", 
    "date_updated": "2014-03-18 14:11:59", 
    "deleted": false, 
    "description": null, 
    "duration": 0, 
    "id": 3, 
    "public": true, 
    "status": "ready",
    "tags": {
        "items": [
            {
                "id": 1,
                "label": "tag 1",
                "description": "this is a description"
            },
            {
                "id": 2,
                "label": "tag 2",
                "description": "this is a description"
            }
        ],
        "total": 2
    }
    "title": "first test video"
}
```
#### Update fields on the video record

```http
POST /api/videos/3 HTTP/1.1
Content-Type: application/json

{
    "description": "this is a new description",
    "title": "this is a new title",
    "category": 34
}
```

```http
HTTP/1.1 204 NO CONTENT
```

### Video Tag

#### List tags associated with a video

```http
GET /api/videos/3/tags HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "tags": {
        "items": [
            {
                "id": 1,
                "label": "tag 1",
                "description": "this is a description"
            },
            {
                "id": 2,
                "label": "tag 2",
                "description": "this is a description"
            }
        ],
        "total": 2
    }
}
```

#### Assign a tag to a video

```http
POST /api/videos/3/tags HTTP/1.1

id=3
```

```http
HTTP/1.1 204 NO CONTENT
```

#### Add a new tag to an account

```http
POST /api/tag HTTP/1.1
Content-Type: application/json

{
    "label": "this is a tag",
    "description": "this is a description"
}
```

```http
HTTP/1.1 204 OK
Content-Type: application/json
Location: /api/tag/TAGID

{
    "id:" "TAGID",
    "href": "/api/tag/TAGID"
}
```

#### Update a tag

```http
PUT /api/tag/TAGID HTTP/1.1
Content-Type: application/json

{
    "label": "this is a tag",
    "description": "this is a description"
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Location: /api/tag/TAGID

{
    "id:" "TAGID",
    "href": "/api/tag/TAGID"
}
```

#### Delete a tag

```http
DELETE /api/tag/TAGID HTTP/1.1
```

```http
HTTP/1.1 204 NO CONTENT
```
