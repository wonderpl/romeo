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
    "description": "desc",
    "video_count": 10,
    "public": true
   }
  ]
 }
}
```

Public tags are associated with Dolly channels.

### Tag create

To create a new tag `POST` to the account tags resource:

```http
POST /api/account/<account_id>/tags HTTP/1.1
Content-Type: application/json

{
 "label": "This will be the collection title",
 "description": "This is a description",
 "public": false
}
```

Property       | Required? | Value               | Description
:------------- | :-------- | :------------------ | :----------
label          | yes       | string (max 256)    | The tag/collection title
description    | no        | string (max 256)    | The description text for the tag/collection
public         | no        | boolean             | If true then a Dolly channel is created

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
    "category": null,
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

### Video detail

To get full video resource record:

```http
GET /api/video/<video_id> HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "id": 51668773,
 "href": "/api/video/51668773",
 "status": "processing",
 "date_added": "2014-03-31T23:16:24.871134",
 "date_updated": "2014-05-01T16:47:33.841167",
 "title": "test",
 "description": "",
 "duration": 60,
 "category": "some cat",
 "link_url": "http://x.com",
 "link_title": "test",
 "player_logo_url": "http://path/to/logo/img",
 "thumbnails": {
  "items": [
   {
    "url": "http://path/to/image.jpg",
    "width": 1920,
    "height": 1080
   }
  ]
 },
 "tags": {
  "href": "/api/video/51668773/tags",
  "items": [
   {
    "id": 5,
    "href": "/api/tag/5",
    "label": "test2",
    "description": "desc"
   }
  ]
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

To update the `cover_image` or `player_logo` use a multipart body with the image data.

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

To set thumbnails from a custom image `PATCH` the video record with image
content for the `cover_image` property. The video thumbnails will be updated
using this image.

Alternatively you can select one of the preview images as the thumbnail source.
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

### Video player parameters

Set player parameters for a video with a `PUT` to the parameters sub-resource:

```http
PUT /api/video/<video_id>/player_parameters HTTP/1.1
Content-Type: application/json

{
 "setting1": "value1",
 "setting2": "value2"
}
```

```http
HTTP/1.1 204 NO CONTENT
```

> :warning: All values will be converted to strings. Any existing parameters will be replaced.


### Video download url

Request the download url sub-resource to get a signed redirect url to access the original
video source file.

```http
GET /api/video/<video_id>/download_url HTTP/1.1
```

```http
HTTP/1.1 302 FOUND
Location: http://s3.amazonaws.com/video/file?Signature=xxx&Expires=1403615607
Content-Type: application/json

{
 "url": "http://s3.amazonaws.com/video/file?Signature=xxx&Expires=1403615607",
 "expires": 600
}
```

### Video share url

Request the share url sub-resource to get a link for the public web page for
a video.

```http
GET /api/video/<video_id>/share_url?target=<target> HTTP/1.1
```

Parameter | Required | Value                   | Description
:-------- | :------- | :---------------------- | :----------
target    | No       | `facebook` or `twitter` | Specifies the target platform for the share url

The response will be a redirect to the public web page.

```http
HTTP/1.1 302 FOUND
Location: http://wonderpl.com/s/cMCYVXg?utm_source=facebook
Content-Type: application/json

{
 "url": "http://wonderpl.com/s/cMCYVXg?utm_source=facebook"
}
```

This service will return a 400 if the video has not been published (i.e. added to a tag
associated with a Dolly channel).

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request"
}
```

### Video embed code

Request the embed code sub-resource to get the code for embedding a video in a HTML page.

```http
GET /api/video/<video_id>/embed_code?style=<style>&width=<width>&height=<height> HTTP/1.1
```

Parameter | Required | Value                   | Description
:-------- | :------- | :---------------------- | :----------
style     | No       | `simple` or `seo`       | The SEO embed includes additional metadata for the page.
width     | No       | alphanumeric            | Specifies the width of the embed iframe
height    | No       | alphanumeric            | Specifies the height of the embed iframe

The response will include the HTML string:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
 "html": "<iframe src=\"http://wonderpl.com/embed/V\" width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>"
}
```

This service will return a 400 if the video has not been published (i.e. added to a tag
associated with a Dolly channel).

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request"
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

A video associated with public tag will be published on Dolly.

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

### Video Comments

Requesting the comments video sub-resource returns a list of comment records.

```http
GET /api/video/<video_id>/comments HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "comment": {
  "total": 1,
  "items": [
   {
    "id": 123,
    "href": "/api/video/51668773/comments/123",
    "datetime": "2014-06-25T18:38:36.311699",
    "comment": "This is a comment",
    "timestamp": 60,
    "username": "Paul Egan",
    "avatar_url": "http://path/to/small/avatar/img.png",
    "resolved": false
   }
  ]
 }
}
```

To add a comment to a video `POST` to the comments sub-resource.

```http
POST /api/video/<video_id>/comments HTTP/1.1
Content-Type: application/json

{
 "comment": "This is a comment",
 "timestamp": 60
}
```

On success a `201` will be returned and a `400` on error.

```http
HTTP/1.1 201 CREATED
Location: /api/video/51668773/comments/2
Content-Type: application/json

{
 "id": 2,
 "href": "/api/video/51668773/comments/2"
}
```

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "comment": ["This field is required."]
 }
}
```

To notify all users about new comments `POST` to the notification sub-resource
with an empty body.

```http
POST /api/video/<video_id>/comments/notification HTTP/1.1
```

```http
HTTP/1.1 204 NO CONTENT
```

To mark a comment as resolved `PATCH` the comment to update the value.

```http
PATCH /api/video/<video_id>/comments/<comment_id> HTTP/1.1
Content-Type: application/json

{
 "resolved": true
}
```

### Video Collaborators

To retrieve a list of collaborators `GET` the sub resource:

```http
GET /api/video/<video_id>/collaborators HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
 "collaborator": {
  "total": 1,
  "items": [
   {
    "username": "Paul Egan",
    "avatar_url": "http://path/to/small/avatar/img.png",
    "permissions": ["can_comment"]
   }
  ]
 }
}
```

To invite an external user to view, download, or comment on a video `POST`
to the collaborators sub-resource.

```http
POST /api/video/<video_id>/collaborators HTTP/1.1
Content-Type: application/json

{
 "email": "paulegan@rockpack.com",
 "name": "Paul Egan",
 "can_comment": true,
 "can_download": false
}
```

On success a `204` will be returned and a `400` on error.

```http
HTTP/1.1 204 NO CONTENT
```

```http
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
 "error": "invalid_request",
 "form_errors": {
  "email": ["Invalid email address."]
 }
}
```

Collaborators can access the following resources:

Resource                             | With Permission
:----------------------------------- | :-------------
`/api/video/<video_id>`              | any
`/api/video/<video_id>/comments`     | `can_comment`
`/api/video/<video_id>/download_url` | `can_download`
