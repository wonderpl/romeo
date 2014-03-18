Video
=====

### Video List

Get all the video records for an account

```http
GET /apivideo HTTP/1.1
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
            "tags": [
                {
                    "id": 3,
                    "label": "tag 1"
                },
                {
                    "id": 4,
                    "label": "tag 2"
                }
            ],
            "title": "first test video"
        }
    ]
}
```

### Video Item

Get a video record

```http
GET /apivideo/3 HTTP/1.1
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
    "tags": [
        {
            "id": 3,
            "label": "tag 1"
        },
        {
            "id": 4,
            "label": "tag 2"
        }
    ],
    "title": "first test video"
}
```
Update fields on the video record

```http
POST /apivideos/3 HTTP/1.1

{
    "description": "this is a new description",
    "title": "this is a new title",
    "category: 34
}
```

```http
HTTP/1.1 204 NO CONTENT
```

### Video Tag

```http
GET /apivideos/3/tag HTTP/1.1

[
    {
        "id": 3,
        "label": "tag 1"
    },
    {
        "id": 4,
        "label": "tag 2"
    }
]
```
