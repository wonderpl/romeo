from wonder.common.sqs import BackgroundSqsProcessor
from wonder.romeo import create_app


if __name__ == '__main__':
    BackgroundSqsProcessor(create_app).run()
