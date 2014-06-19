from flask import Blueprint, render_template, make_response, abort
from wonder.romeo import db
from wonder.romeo.account.views import dolly_account_view
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.video.models import Video, VideoSeoEmbed
from .forms import VideoSeoEmbedForm


seoapp = Blueprint('seo', __name__)


class SiteMap(object):
    def __init__(self):
        self.items = []

    def tag_items(self, items, prefix=None, size=0):
        tabs = "\t" * (size + 1)
        wrapped = []
        for item, value in items.iteritems():
            open_tag = "<{}>".format(item)
            close_tag = "</{}>".format(item)

            if isinstance(value, dict):
                wrapped.append(tabs + open_tag + "\r\n")
                wrapped.append(self.tag_items(value, prefix=item, size=size + 1))
                wrapped.append(tabs + close_tag + "\r\n")
            else:
                wrapped.append(''.join([tabs, open_tag, str(value), close_tag, "\r\n"]))

        return ''.join(wrapped)

    def add_item(self, item):
        self.items.append(item)

    def render(self):
        xml = '\r'.join("<url>\r\n" + self.tag_items(item) + "</url>\r\n" for item in self.items)
        return """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
{}</urlset>""".format(xml)


@seoapp.route('/seo/sitemaps/<int:account_id>.xml')
def sitemap(account_id):
    # TODO: filter on account
    videos = VideoSeoEmbed.query.join(
        Video,
        (Video.id == VideoSeoEmbed.video_id) &
        (Video.account_id == account_id)
    ).with_entities(Video, VideoSeoEmbed)

    sitemap = SiteMap()

    for video, embed in videos:
        sitemap.add_item(
            {
                'loc': embed.link_url,
                'lastmod': video.date_updated,
                'changefreq': 'monthly',
                'video:video': {
                    'video:title': video.title,  # Required
                    'video:thumbnail': video.thumbnails[0].url if video.thumbnails else '',  # Required
                    'video:description': video.description if video.description else embed.description,  # Required
                    'video:player_loc': "http://dev.wonderpl.com/embed/{}".format(video.id),
                    'video:duration': video.duration
                }})
    resp = make_response(sitemap.render())
    resp.headers['Content-Type'] = 'application/xml'
    return resp


@api_resource('/seo/account/<int:account_id>/sitemaps')
class SiteMaps(Resource):

    @commit_on_success
    @dolly_account_view
    def post(self, account, dollyuser):
        form = VideoSeoEmbedForm(csrf_enabled=False)
        if form.validate():
            db.session.add(
                VideoSeoEmbed(
                    video_id=form.video_id.data,
                    link_url=form.link_url.data,
                    title=form.title.data,
                    description=form.description.data))
            return None, 201
        else:
            return dict(error='invalid_request',
                        form_errors=form.errors), 400

    @dolly_account_view
    def get(self, account, dollyuser):
        embed_list = VideoSeoEmbed.query.join(
            Video,
            (Video.id == VideoSeoEmbed.video_id) &
            (Video.account_id == account.id)
        ).with_entities(
            Video, VideoSeoEmbed)

        embeds = []

        for video, embed in embed_list:
            embeds.append({
                'id': embed.id,
                'link_url': embed.link_url,
                'title': video.title,
                'description': video.description if video.description else embed.description
            })

        return dict(embeds=embeds, total=embed_list.count())


@api_resource('/seo/account/<int:account_id>/sitemaps/<int:item>')
class SiteMapItem(Resource):

    @commit_on_success
    def delete(self, account_id, item):
        embed, video = VideoSeoEmbed.query.filter(
            VideoSeoEmbed.id == item
        ).join(
            Video,
            (Video.id == VideoSeoEmbed.video_id) &
            (Video.account_id == account_id)
        ).with_entities(VideoSeoEmbed, Video).first_or_404()

        if video.account_id == account_id:
            db.session.delete(embed)
        else:
            abort(403)

        return None, 204


@seoapp.route('/seo/sitemaps/')
def sitemap_help():
    return render_template('seo/help.html', headers={'Content-Type': 'application/xml'})


@seoapp.route('/seo/embed/')
def seo_embed():
    video = Video.query.filter().first()
    return render_template('seo/embed.html', video=video)
