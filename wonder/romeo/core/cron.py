from wonder.common.cron import CronProcessor
from wonder.romeo import create_app, manager
from wonder.romeo.root.models import JobControl


if __name__ == '__main__':
    CronProcessor(manager, JobControl, create_app).run()
