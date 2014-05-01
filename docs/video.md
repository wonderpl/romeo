Tag
===

Tags can be used to group videos into one or more collections.

### Tag list

```http
GET /api/account/<account_id>/tags HTTP/1.1
```

Returns a list of video tag items:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "tag": {
  "total": 1,
  "items": [
   {
    "id": 4,
    "href": "/api/tag/4",
    "label": "test",
    "description": "desc"
   }
  ]
 }
}
```


### Tag create

To create a new tag `POST` to the account tags resource:

```http
POST /api/account/<account_id>/tags HTTP/1.1
Content-Type: application/json

{
 "label": "This will be the collection title",
 "description": "This is a description"
}
```

Property       | Required? | Value               | Description
:------------- | :-------- | :------------------ | :----------
label          | yes       | string (max 256)    | The tag/collection title
description    | no        | string (max 256)    | The description text for the tag/collection

On success, a `201` with the tag resource url will be returned:

```http
HTTP/1.1 201 CREATED
Location: /api/tag/5
Content-Type: application/json

{
 "id:" 5,
 "href": "/api/tag/5"
}
```

A `400` will be returned on error:

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "label": [ "Tag already exists" ]
 }
}
```

### Tag update

To update a tag, `PUT` replacement properties to the tag resource url:

```http
PUT /api/tag/<tag_id> HTTP/1.1
Content-Type: application/json

{
 "label": "This will be the collection title",
 "description": "This is a description"
}
```

All values will replace the existing record.

On success a `204` will be returned.

```http
HTTP/1.1 204 NO CONTENT
```

### Tag delete

```http
DELETE /api/tag/<tag_id> HTTP/1.1
```

```http
HTTP/1.1 204 NO CONTENT
```

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
    "player_logo_url": null,
    "duration": 600,
    "thumbnails": {
     "items": []
    },
    "tags": {
     "href": "/api/video/34489679/tags",
     "items": []
    }
   }
  ]
 }
}
```

### Video create

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
Location: /api/video/76804765
Content-Type: application/json

{
 "id": 76804765,
 "href": "/api/video/76804765",
 "status": "uploading"
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

### Video update

To update the video record `PATCH` the video resource with the changed properties.
Any properties not specified in the `PATCH` body will be left unchanged.

```http
PATCH /api/video/<video_id> HTTP/1.1
Content-Type: application/json

{
 "title": "This is a new title",
 "description": "this is a new description",
 "category": 34
}
```

To update the `player_logo` use a multipart body with the image data.

```http
PATCH /api/video/<video_id> HTTP/1.1
Content-Type: multipart/form-data; boundary=---xxx

---xxx
Content-Disposition: form-data; name="player_logo"; filename="img.png"
Content-Type: application/octet-stream

....PNG...
```

On success a `200` with the updated resource record will be returned (in the same format
as a `GET`).

### Video delete

```http
DELETE /api/video/<video_id> HTTP/1.1
```

```http
HTTP/1.1 204 NO CONTENT
```

### Video thumbnails

To get a list of images extracted from the key frames of a video:

```http
GET /api/video/<video_id>/preview_images HTTP/1.1
```

Each item in the response includes the time of the key frame that can be used as an identifier
for setting the `primary_preview_image`. The number of images returned depends on the length
of the video. The images should be the same width and height as the video content.

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "image": {
  "items": [
   {
    "time": 0,
    "url": "http://path/to/image",
    "width": 1920,
    "height": 1080
   }
  ]
 }
}
```

To set the primary image `PUT` the required time index to the `primary_preview_image`
sub-resource:

```http
PUT /api/video/<video_id>/primary_preview_image HTTP/1.1
Content-Type: application/json

{"time": 45000}
```

On success the response will list all the available thumbnails for that image:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "image": {
  "items": [
   {
    "url": "http://path/to/thumbnail1",
    "width": 96,
    "height": 54
   }
  ]
 }
}
```

### Video tags

To associate a tag with a video (add a video to a collection), `POST` the tag id to the video
tags sub-resource:

```http
POST /api/video/<video_id>/tags HTTP/1.1
Content-Type: application/json

{
 "id": 3
}
```

The resource url for the new tag relation will be returned in a `201` response:

```http
HTTP/1.1 201 CREATED
Location: /api/video/51668773/tags/3
Content-Type: application/json

{
 "href": "/api/video/51668773/tags/3"
}
```

A `204` will be returned if the video is already associated with the tag:

```http
HTTP/1.1 204 NO CONTENT
```

If the tag id is invalid a `400` will be returned:


```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "id": ["Invalid tag id"]
 }
}
```

To remove a tag from a video `DELETE` the relation resource:

```http
DELETE /api/video/<video_id>/tags/<tag_id> HTTP/1.1
```

```http
HTTP/1.1 204 NO CONTENT
```
