Video
=====

### Video List

#### Get all the video records for an account

```http
GET /api/video HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "videos": [
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
    ]
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
GET /api/videos/3/tag HTTP/1.1
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
POST /api/videos/3/tag HTTP/1.1

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
