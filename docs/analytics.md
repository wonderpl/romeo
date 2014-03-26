Analytics
=========

### Performance Metrics

```http
GET /api/analytics/performance/VIDEOID HTTP/1.1
```

Parameter       | Required    | Value    | Description
:-------------- | :---------- | :------- | :----------
start           | No          | Date                     | eg. 2014-03-12
end             | No          | Date                     | eg. 2014-03-12
limit           | No          | Integer                  | Page size
page_token      | No          | String                   | Next page to fetch. Null if no next page
breakdown_by    | No          | 'day', 'week', 'month'   | Group stats by period

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "metrics": [
        {
            "daily_uniq_plays": 0, 
            "date": "2014-03-12", 
            "monthly_uniq_plays": 0, 
            "plays": 0, 
            "playthrough_100": 0, 
            "playthrough_25": 0, 
            "playthrough_50": 0, 
            "playthrough_75": 0, 
            "weekly_uniq_plays": 0
        },
        {
            "daily_uniq_plays": 0, 
            "date": "2014-03-13", 
            "monthly_uniq_plays": 0, 
            "plays": 0, 
            "playthrough_100": 0, 
            "playthrough_25": 0, 
            "playthrough_50": 0, 
            "playthrough_75": 0, 
            "weekly_uniq_plays": 0
        },
        {
            "daily_uniq_plays": 8, 
            "date": "2014-03-18", 
            "monthly_uniq_plays": 8, 
            "plays": 8, 
            "playthrough_100": 0, 
            "playthrough_25": 2, 
            "playthrough_50": 1, 
            "playthrough_75": 0, 
            "weekly_uniq_plays": 8
        }
    ]
    "next_page_token": "W1siY29sdW1uIiwiR0I6MTA4ODMiXSxbImluZGV4IiwyM10sWyJ2YWx1ZSIsMV1d"
}
```

### Geographical Metrics (By City)

```http
GET /api/analytics/cities/VIDEOID HTTP/1.1
```

Parameter       | Required    | Value    | Description
:-------------- | :---------- | :------- | :----------
start           | No          | Date     | eg. 2014-03-12
end             | No          | Date     | eg. 2014-03-12
limit           | No          | Integer  | Page size
page_token      | No          | String   | Next page to fetch. Null if no next page

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "metrics": [
        {
            "geo": {
                "location": {
                    "lat": "54.945", 
                    "long": "-1.6175"
                }, 
                "name": "Gateshead"
            }, 
            "video": {
                "daily_uniq_plays": 4, 
                "monthly_uniq_plays": 4, 
                "plays": 4, 
                "playthrough_100": 0, 
                "playthrough_25": 1, 
                "playthrough_50": 0, 
                "playthrough_75": 0, 
                "viewing_time": 1055609, 
                "weekly_uniq_plays": 4
            }
        },
        {
            "geo": {
                "location": {
                    "lat": "28.666667", 
                    "long": "77.216667"
                },
                "name": "Delhi"
            },
            "video": {
                "daily_uniq_plays": 2, 
                "monthly_uniq_plays": 2, 
                "plays": 2, 
                "playthrough_100": 0, 
                "playthrough_25": 1, 
                "playthrough_50": 0, 
                "playthrough_75": 0, 
                "viewing_time": 2214343, 
                "weekly_uniq_plays": 2
            }
        },
        {
            "geo": {
                "location": {
                    "lat": "52.466667", 
                    "long": "-1.916667"
                },
                "name": "Birmingham"
            }, 
            "video": {
                "daily_uniq_plays": 2, 
                "monthly_uniq_plays": 2, 
                "plays": 2, 
                "playthrough_100": 0, 
                "playthrough_25": 2, 
                "playthrough_50": 1, 
                "playthrough_75": 1, 
                "viewing_time": 5396885, 
                "weekly_uniq_plays": 2
            }
        },
    ]
    "next_page_token": "W1siY29sdW1uIiwiR0I6MTA4ODMiXSxbImluZGV4IiwyM10sWyJ2YWx1ZSIsMV1d"
}
```

### Geographical Metrics (By Country)

```http
GET /api/analytics/countries/VIDEOID HTTP/1.1
```

Parameter       | Required    | Value    | Description
:-------------- | :---------- | :------- | :----------
start           | No          | Date     | eg. 2014-03-12
end             | No          | Date     | eg. 2014-03-12
limit           | No          | Integer  | Page size
page_token      | No          | String   | Next page to fetch. Null if no next page

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "metrics": [
        {
            "geo": {
                "name": "United Kingdom"
            }, 
            "video": {
                "daily_uniq_plays": 16, 
                "monthly_uniq_plays": 16, 
                "plays": 16, 
                "playthrough_100": 0, 
                "playthrough_25": 4, 
                "playthrough_50": 2, 
                "playthrough_75": 1, 
                "viewing_time": 9762229, 
                "weekly_uniq_plays": 16
            }
        },
        {
            "geo": {
                "name": "India"
            },
            "video": {
                "daily_uniq_plays": 3, 
                "monthly_uniq_plays": 3, 
                "plays": 3, 
                "playthrough_100": 0, 
                "playthrough_25": 1, 
                "playthrough_50": 0, 
                "playthrough_75": 0, 
                "viewing_time": 2409837, 
                "weekly_uniq_plays": 3
            }
        }
    ]
    "next_page_token": "W1siY29sdW1uIiwiR0I6MTA4ODMiXSxbImluZGV4IiwyM10sWyJ2YWx1ZSIsMV1d"
}
```

### Geographical Metrics (By Country and Region)

```http
GET /api/analytics/countries/COUNTRYID/VIDEOID HTTP/1.1
```

Parameter       | Required    | Value    | Description
:-------------- | :---------- | :------- | :----------
start           | No          | Date     | eg. 2014-03-12
end             | No          | Date     | eg. 2014-03-12
limit           | No          | Integer  | Page size
page_token      | No          | String   | Next page to fetch. Null if no next page

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "metrics": [
        {
            "geo": {
                "name": "Essex"
            },
            "video": {
                "daily_uniq_plays": 1,
                "monthly_uniq_plays": 1,
                "plays": 1,
                "playthrough_100": 1,
                "playthrough_25": 1,
                "playthrough_50": 1,
                "playthrough_75": 1,
                "viewing_time": 69090,
                "weekly_uniq_plays": 1
            }
        },
        {
            "geo": {
                "name": "Hillingdon"
            },
            "video": {
                "daily_uniq_plays": 0,
                "monthly_uniq_plays": 0,
                "plays": 0,
                "playthrough_100": 0,
                "playthrough_25": 0,
                "playthrough_50": 0,
                "playthrough_75": 0,
                "viewing_time": 0,
                "weekly_uniq_plays": 0
            }
        }
    ],
    "next_page_token": "W1siY29sdW1uIiwiR0I6MTA4ODMiXSxbImluZGV4IiwyM10sWyJ2YWx1ZSIsMV1d"
}
```
