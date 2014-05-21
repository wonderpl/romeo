import os
import sys
import time
import signal
from functools import wraps
from flask import g, current_app
from boto.sqs import connect_to_region
from boto.sqs.jsonmessage import JSONMessage
from wonder.romeo import create_app


def hup_handler(sighup, frame):
    global _hup_received
    _hup_received = True
_hup_received = False


class SqsProcessor(object):

    queue_name = None
    visibility_timeout = None
    message_class = JSONMessage

    # _queue is a class property shared between all instances
    _queue = None

    @classmethod
    def getqueue(cls):
        if not cls._queue:
            conn = connect_to_region(current_app.config['SQS_REGION'])
            name_prefix = current_app.config['SQS_QUEUE_NAME_PREFIX']
            cls._queue = conn.get_queue(name_prefix + cls.queue_name)
            if not cls._queue:
                raise Exception('Unable to access queue: %s' % cls.queue_name)
            cls._queue.set_message_class(cls.message_class)
        return cls._queue

    @classmethod
    def write_message(cls, message, delay_seconds=None):
        if delay_seconds is None:
            delay_seconds = current_app.config.get('SQS_DEFAULT_DELAY_SECONDS')
        cls.getqueue().write(cls.message_class(body=message), delay_seconds)

    def process_message(self, message):
        pass

    def poll(self):
        message = self.getqueue().read(self.visibility_timeout)
        if not message:
            return
        if self.process_message(message.get_body()) is not False:
            # Delete only on success
            message.delete()

    def run(self):
        app = current_app or create_app()

        # Catch HUP from uwsgi
        signal.signal(signal.SIGHUP, hup_handler)

        while True:
            if os.path.exists('/tmp/romeo-sqs-%s.lock' % self.queue_name):
                time.sleep(10)
            else:
                with app.app_context():
                    self.poll()
            if _hup_received:
                sys.exit()


def _run_call(message):
    try:
        module = __import__(message['module'], fromlist=True)
        func = getattr(module, message['function'])
    except (ImportError, AttributeError):
        current_app.logger.error('Unable to parse background message: %s', message)
        return False

    # Don't use background_on_sqs wrapper again
    func = getattr(func, '_orig_func', func)

    try:
        func(*message['args'], **message['kwargs'])
    except Exception:
        current_app.logger.exception('Unable to run background function %s', message['function'])
        return False
    else:
        current_app.logger.debug('Ran background function %s', message['function'])


def init_app(app):
    if not app.config.get('ENABLE_BACKGROUND_SQS'):
        @app.teardown_request
        def _run_later(exception):
            if not exception and '_background_on_sqs' in g:
                for call in g._background_on_sqs:
                    _run_call(call)
                g._background_on_sqs = []


class BackgroundSqsProcessor(SqsProcessor):

    queue_name = 'background'
    visibility_timeout = 3600   # big enough for video upload

    def process_message(self, message):
        return _run_call(message)


def background_on_sqs(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        call = dict(
            module=func.__module__,
            function=func.__name__,
            args=args,
            kwargs=kwargs,
        )
        if current_app.config.get('ENABLE_BACKGROUND_SQS'):
            BackgroundSqsProcessor.write_message(call)
        else:
            # put the call on the request context for _run_later
            if '_background_on_sqs' not in g:
                g._background_on_sqs = []
            g._background_on_sqs.append(call)
    wrapper._orig_func = func
    return wrapper


if __name__ == '__main__':
    BackgroundSqsProcessor().run()
