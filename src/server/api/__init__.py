from flask import Flask
from flask.ext.admin import Admin
from flask.ext.mongoengine import MongoEngine
from pymongo import read_preferences
from flask.ext.security import MongoEngineUserDatastore, Security, MongoEngineUserDatastoreBase
from os import environ
from flask.ext.security.utils import encrypt_password

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')

db = MongoEngine()
admin = Admin(name="MozillaDelhi API")
app.secret_key = environ['SECRET_KEY']

# app.config['MONGODB_SETTINGS'] = {'DB':'mozilladelhi', 'HOST':'mongodb://test:test@ds057862.mongolab.com:57862/mozilladelhi'}
# app.config.from_object = 'settings.dbconfig'
app.config['MONGODB_SETTINGS'] = {'DB': environ['DB'], 'HOST': environ['HOST']}
app.config['SECURITY_PASSWORD_HASH'] = environ['SECURITY_PASSWORD_HASH']
app.config['SECURITY_PASSWORD_SALT'] = environ['SECURITY_PASSWORD_SALT']

db.init_app(app)
admin.init_app(app)

from api import models
from api import views
from api import administration

# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, models.User, models.Role)
security = Security(app, user_datastore)


class MongoEngineUserDatastore(MongoEngineUserDatastoreBase):

    def _prepare_create_user_args(self, **kwargs):
        from flask.ext.security.utils import encrypt_password
        if 'password' in kwargs:
            kwargs['password'] = encrypt_password(kwargs['password'])
        return super(MongoEngineUserDatastore, self)._prepare_create_user_args(**kwargs)

# Create a user to test with
# Example code snippet to connect your User and Roles in MongoEngine
# @app.before_first_request
# def create_user():
#     user = user_datastore.create_user(email='sanyam.khurana@thegeekyway.com', password=encrypt_password('password'))
#     role = user_datastore.create_role(name="admin", description="User with Administrative priviliges")
#     # default_role = user_datastore.find_or_create_role("admin")
#     user_datastore.add_role_to_user(user, role)