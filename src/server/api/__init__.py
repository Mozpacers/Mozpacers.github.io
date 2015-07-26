from flask import Flask
from flask.ext.admin import Admin
from flask.ext.mongoengine import MongoEngine
from pymongo import read_preferences
from flask.ext.security import MongoEngineUserDatastore, Security
from os import environ

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')

db = MongoEngine()
admin = Admin(name="MozillaDelhi API")
app.secret_key = environ['SECRET_KEY']

# app.config['MONGODB_SETTINGS'] = {'DB':'mozilladelhi', 'HOST':'mongodb://test:test@ds057862.mongolab.com:57862/mozilladelhi'}
# app.config.from_object = 'settings.dbconfig'
app.config['MONGODB_SETTINGS'] = {'DB': environ['DB'], 'HOST': environ['HOST']}

db.init_app(app)
admin.init_app(app)

from api import models
from api import views
from api import administration

# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, models.User, models.Role)
security = Security(app, user_datastore)

# Create a user to test with
@app.before_first_request
def create_user():
    user_datastore.create_user(email='sanyam.khurana@thegeekyway.com', password='password')
