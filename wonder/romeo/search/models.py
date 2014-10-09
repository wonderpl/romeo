from sqlalchemy import event, DDL
from wonder.romeo.video.models import Video, VideoLocaleMeta
from wonder.romeo.account.models import AccountUser


def _weighted_vector(expr, weight, catalog='english'):
    return "setweight(to_tsvector('pg_catalog.%s', coalesce(%s, '')), '%s')" % (catalog, expr, weight)


ACCOUNT_USER_SEARCH_VECTOR = ' || '.join(
    _weighted_vector(*a) for a in (
        ('new.display_name', 'A', 'english'),   # Should use simple catalog?
        ('new.title', 'A', 'english'),
        ('new.description', 'B', 'english'),
        ('new.search_keywords', 'B', 'english'),    # simple?
        ("string_agg(coalesce(vlm.title, v.title, ''), ' ')", 'D', 'english'),
        ("string_agg(vlm.search_keywords, ' ')", 'D', 'english'),   # simple?
    )
)


VIDEO_SEARCH_VECTOR = ' || '.join(
    _weighted_vector(*a) for a in (
        ('coalesce(vlm.title, new.title)', 'A', 'english'),
        ('vlm.strapline', 'A', 'english'),
        ('vlm.description', 'B', 'english'),
        ('vlm.search_keywords', 'B', 'english'),    # simple?
        ('a.name', 'C', 'english'),     # simple?
    )
)

account_user_search_vector_trigger = DDL('''
    create or replace function account_user_search_vector_trigger() returns trigger as $$
    declare vector tsvector;
    begin
        select %s into vector
        from account a
        left join video v on v.account = a.id
        left join video_locale_meta vlm on vlm.video = v.id and vlm.locale = ''
        where a.id = new.account
        group by a.id;

        new.search_vector := vector;
        return new;
    end
    $$ language plpgsql;

    create trigger account_user_search_vector_update
    before insert or update on account_user
    for each row execute procedure account_user_search_vector_trigger();
''' % ACCOUNT_USER_SEARCH_VECTOR)
event.listen(AccountUser.__table__, 'after_create',
             account_user_search_vector_trigger.execute_if(dialect='postgresql'))


video_search_vector_trigger = DDL('''
    create or replace function video_search_vector_trigger() returns trigger as $$
    declare vector tsvector;
    begin
        update account_user set date_updated = new.date_updated where account = new.account;

        select %s into vector
        from account a
        left join video_locale_meta vlm on vlm.video = new.id and vlm.locale = ''
        where a.id = new.account
        group by a.id, vlm.id;

        new.search_vector := vector;
        return new;
    end
    $$ language plpgsql;

    create trigger video_search_vector_update
    before insert or update on video
    for each row execute procedure video_search_vector_trigger();
''' % VIDEO_SEARCH_VECTOR)
event.listen(Video.__table__, 'after_create',
             video_search_vector_trigger.execute_if(dialect='postgresql'))


video_local_meta_update_trigger = DDL('''
    create or replace function video_local_meta_update_trigger() returns trigger as $$
    begin
        update video set date_updated = now() where id = new.video;
        return new;
    end
    $$ language plpgsql;

    create trigger video_local_meta_update
    after insert or update on video_locale_meta
    for each row execute procedure video_local_meta_update_trigger();
''')
event.listen(VideoLocaleMeta.__table__, 'after_create',
             video_local_meta_update_trigger.execute_if(dialect='postgresql'))
