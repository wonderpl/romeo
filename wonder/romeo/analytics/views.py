from datetime import datetime
from flask import request, json
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core import ooyala


class MissingDateRange(Exception):
    pass


DATE_FORMAT = '%Y-%m-%d'


def _format_dates(start, end):
    sanitised_dates = []
    for d in [start, end]:
        if isinstance(d, datetime):
            sanitised_dates.append(d.strftime(DATE_FORMAT))
        else:
            sanitised_dates.append(d)

    date_range = '...'.join(filter(None, sanitised_dates))
    if not date_range:
        raise MissingDateRange

    return date_range


def _videos_request(feed, path='', breakdown_by='', limit=50, page_token=None):
    q_params = dict(limit=limit)
    if page_token:
        q_params['page_token'] = page_token
    if breakdown_by:
        q_params['breakdown_by'] = breakdown_by
    return ooyala.ooyala_request(feed, path, query_params=q_params)


def video_data_transform(d):
    metrics = d['metrics']['video']
    return {
        'plays': metrics.get('plays', 0),
        'daily_uniq_plays': metrics.get('uniq_plays', {}).get('daily_uniqs', 0),
        'weekly_uniq_plays': metrics.get('uniq_plays', {}).get('weekly_uniqs', 0),
        'monthly_uniq_plays': metrics.get('uniq_plays', {}).get('monthly_uniqs', 0),
        'playthrough_100': metrics.get('playthrough_100', 0),
        'playthrough_75': metrics.get('playthrough_75', 0),
        'playthrough_50': metrics.get('playthrough_50', 0),
        'playthrough_25': metrics.get('playthrough_25', 0),
    }


def process_performance(data):
    if not data['results']:
        return dict(metrics=[])
    metrics = data['results']['total']
    result = []
    for m in metrics:
        r = dict(date=m['date'])
        if m.get('metrics'):
            r.update(video_data_transform(m))
        result.append(r)
    return dict(metrics=result)


def process_geo(data):
    result = []
    for m in data['results']:
        this = {}
        this['video'] = video_data_transform(m)
        this['video']['viewing_time'] = m['metrics']['video'].get('time_watched', 0)
        this.setdefault('geo', {}).update({'name': m['name']})
        # For some reason this is a string and not a dict
        if m.get('geo_data'):
            if m['geo_data'] is None:
                this['geo']['location'] = {}
            else:
                if not type(m['geo_data']) is dict:
                    m['geo_data'] = json.loads(m['geo_data'])
                this['geo']['location'] = m['geo_data']['location']
        if m['metrics']['video'].get('name'):
            m['country_name'] = m['video']['name']
            m['region_count'] = m['video']['region_count']

        result.append(this)
    return dict(metrics=result, next_page_token=data.get('next_page_token'))


def process_total(data):
    transformed_data = {}
    for d in data.get('results'):
        try:
            video_id = d['movie_data']['embed_code']
        except:  # missing data, skip
            continue
        transformed_data.update({
            video_id: {
                'name': d['name'],
                'metrics': video_data_transform(d)
            }
        })
        if d.get('name'):
            transformed_data[video_id] = d['name']
    return transformed_data


def videos_total(start, end=None, limit=100):
    path = 'reports/account/performance/videos/%s' % (_format_dates(start, end))
    return process_total(_videos_request('analytics', path, limit=limit))


def videos_individual(resource_id, start, end=None, limit=50, page_token=None, breakdown_by='day'):
    path = 'reports/asset/%s/performance/total/%s' % (resource_id, _format_dates(start, end))
    return process_performance(_videos_request('analytics', path, breakdown_by=breakdown_by, limit=limit, page_token=page_token))


def video_cities(resource_id, start, end=None, limit=10, page_token=None):
    path = 'reports/asset/%s/performance/cities/%s' % (resource_id, _format_dates(start, end))
    return process_geo(_videos_request('analytics', path, limit=limit, page_token=page_token))


def video_countries(resource_id, start, end=None, limit=100, page_token=None):
    path = 'reports/asset/%s/performance/countries/%s' % (resource_id, _format_dates(start, end))
    return process_geo(_videos_request('analytics', path, limit=limit, page_token=page_token))


def video_regions(resource_id, country, start, end=None, limit=53, page_token=None):
    path = 'reports/asset/%s/performance/countries/%s/regions/%s' % (resource_id, country, _format_dates(start, end))
    return process_geo(_videos_request('analytics', path, limit=limit, page_token=page_token))


def get_resource_id_from_video(video):
    # Wonder pl tour video
    return 'BkYXAzbDrwONuDpU3yHx8T-CLHna-_5N'


def default_args(request):
    return [request.args.get('start', datetime.now())]


def default_kwargs(request):
    k = {}
    if request.args.get('end'):
        k['end'] = request.args.get('end')
    if request.args.get('limit'):
        k['limit'] = request.args.get('limit')
    if request.args.get('page_token'):
        k['page_token'] = request.args.get('page_token')
    return k


@api_resource('/video/<string:video_id>/analytics/performance')
class PerformanceMetricsApi(Resource):
    def get(self, video_id):
        data = videos_individual(
            get_resource_id_from_video(video_id),
            *default_args(request),
            breakdown_by=request.args.get('breakdown_by', 'day'),
            **default_kwargs(request))
        return data


@api_resource('/video/<string:video_id>/analytics/city')
class CitiesMetricsApi(Resource):
    def get(self, video_id):
        data = video_cities(
            get_resource_id_from_video(video_id),
            request.args.get('start', datetime.now()),
            request.args.get('end', None))
        return data


@api_resource('/video/<string:video_id>/analytics/country')
class CountriesMetricsApi(Resource):
    def get(self, video_id):
        data = video_countries(
            get_resource_id_from_video(video_id),
            request.args.get('start', datetime.now()),
            request.args.get('end', None))
        return data


@api_resource('/video/<string:video_id>/analytics/country/<string:country>')
class RegionsMetricsApi(Resource):
    def get(self, video_id, country):
        data = video_regions(
            get_resource_id_from_video(video_id),
            country.upper(),
            *default_args(request),
            **default_kwargs(request))
        return data
