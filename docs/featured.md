Homepage features
=================


### Featured

Featured users and articles to highlight on the homepage

```http
GET /api/featured HTTP/1.1
```

Returns lists of users and articles:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "published_date": "Mon, 29 Sep 2014 10:17:25 +0000",
  "user": {
    "total": 1,
    "items": [
      {
        "id": 27250600,
        "href": "/api/user/27250600",
        "display_name": "dolly user name",
        "description": "dolly profile description",
        "profile_cover": "http://path/to/dolly/profile/cover.jpg",
        "avatar": "http://path/to/dolly/avatar/image.jpg"
      }
    ]
  },
  "article": {
    "total": 1,
    "items": [
      {
        "article_type": "blog",
        "article_url": "http://blog.wonderpl.com/2014/10/01/002-find-your-next-crew-member",
        "title": "Find your next crew member with Wonder",
        "category": [
          "Latest from the Editor"
        ],
        "author": "Channel No5",
        "summary": "article summary",
        "content": "article content",
        "published_date": "Fri, 15 Aug 2014 10:17:25 +0000",
        "featured_image": "http://path/to/article/featured_image.jpg"
      }
    ]
  }
}
```

