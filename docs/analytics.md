Analytics
=========

### Performance Metrics

```http
GET /analytics/performance/VIDEOID HTTP/1.1
```
Parameter       | Required    | Value    | Description
:-------------- | :---------- | :------- | :----------
start           | No          | Date     | eg. 2014-03-12
end             | No          | Date     | eg. 2014-03-12

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
}
```

### Geographical Metrics (By City)

```http
GET /analytics/cities/VIDEOID HTTP/1.1
```

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
}
```

### Geographical Metrics (By Country)

```http
GET /analytics/cities/VIDEOID HTTP/1.1
```

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
}
```
