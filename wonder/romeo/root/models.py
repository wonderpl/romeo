from sqlalchemy import Column, String, DateTime
from wonder.romeo import db


class JobControl(db.Model):
    job = Column(String(32), primary_key=True)
    next_run = Column(DateTime(), nullable=True)
