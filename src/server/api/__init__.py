from flask import Flask
from flask.ext.admin import Admin
from flask.ext.mongoengine import MongoEngine
from pymongo import read_preferences
from flask.ext.security import MongoEngineUserDatastore, Security
from os import environ
from flask.ext.security.utils import encrypt_password
from flask.ext.cors import CORS
from flask.ext.admin.base import MenuLink
from flask.ext.login import current_user

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

db = MongoEngine()
admin = Admin(name="MozillaDelhi API")
app.secret_key = environ['SECRET_KEY']

# Configurations for MongoDB
app.config['MONGODB_SETTINGS'] = {'DB': environ['DB'], 'HOST': environ['HOST']}

# Configurations for storing password hashes
app.config['SECURITY_PASSWORD_HASH'] = environ['SECURITY_PASSWORD_HASH']
app.config['SECURITY_PASSWORD_SALT'] = environ['SECURITY_PASSWORD_SALT']

app.config['SECURITY_POST_LOGIN_VIEW'] = environ['SECURITY_POST_LOGIN_VIEW']

class AuthenticatedMenuLink(MenuLink):
    def is_accessible(self):
        return current_user.is_authenticated()


class NotAuthenticatedMenuLink(MenuLink):
    def is_accessible(self):
        return not current_user.is_authenticated()

admin.add_link(NotAuthenticatedMenuLink(name='Login', url='/login'))
admin.add_link(AuthenticatedMenuLink(name='Logout', url='/logout'))

db.init_app(app)
admin.init_app(app)

from api import models
from api import views
from api import administration

# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, models.User, models.Role)
security = Security(app, user_datastore)
