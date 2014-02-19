from flask.ext.login import UserMixin


class AuthUser(UserMixin):

    def __init__(self, id):
        self.id = id

    def get_id(self):
        return self.id
