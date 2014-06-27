from flask import Blueprint, render_template, request, make_response, current_app as app
from wonder.romeo import db
from wonder.romeo.video.models import Video, VideoSeoEmbed


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
        Video.id == VideoSeoEmbed.video_id).with_entities(Video, VideoSeoEmbed)

    sitemap = SiteMap()

    for video, embed in videos:
        sitemap.add_item(
            {
                'loc': embed.link_url,
                'lastmod': video.date_updated,
                'changefreq': 'monthly',
                'video:video': {
                    'video:title': embed.title,  # Required
                    'video:thumbnail_loc': video.thumbnails[0].url if video.thumbnails else '',  # Required
                    'video:description': embed.description,  # Required
                    'video:player_loc': "http://dev.wonderpl.com/embed/{}".format(video.id),
                    'video:duration': video.duration
                }})
    resp = make_response(sitemap.render())
    resp.headers['Content-Type'] = 'application/xml'
    return resp


@seoapp.route('/seo/sitemaps/add/', methods=('GET', 'POST',))
def sitemap_add():
    ctx = {}
    if request.method == 'POST':
        for i in ('video', 'title', 'description', 'link_url'):
            if not request.form.get(i, '').strip():
                ctx['errors'] = 'Missing {}'.format(i)
                break
        else:
            try:
                db.session.add(
                    VideoSeoEmbed(
                        video_id=request.form.get('video'),
                        link_url=request.form.get('link_url'),
                        title=request.form.get('title'),
                        description=request.form.get('description')
                    ))
                db.session.commit()
            except Exception, e:
                ctx['errors'] = str(e)
                app.logger.error(e)
    elif request.args.get('delete'):
        db.session.delete(VideoSeoEmbed.query.get(request.args.get('delete')))
        db.session.commit()

    video_list = Video.query.outerjoin(
        VideoSeoEmbed,
        VideoSeoEmbed.video_id == Video.id
    ).with_entities(
        Video, VideoSeoEmbed)

    videos = []
    embeds = []

    for video, embed in video_list:
        videos.append(video)
        if embed:
            embed.video = video
            embeds.append(embed)

    ctx.update({'videos': videos})
    ctx.update({'embeds': embeds})

    return render_template('seo/add.html', **ctx)


@seoapp.route('/seo/sitemaps/')
def sitemap_help():
    return render_template('seo/help.html', headers={'Content-Type': 'application/xml'})


@seoapp.route('/seo/embed/')
def seo_embed():
    video = Video.query.filter().first()
    return render_template('seo/embed.html', video=video)
