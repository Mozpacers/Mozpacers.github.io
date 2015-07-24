from flask import Flask
from flask.ext.admin import Admin
from flask.ext.mongoengine import MongoEngine
from pymongo import read_preferences
from flask.ext.security import MongoEngineUserDatastore, Security

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')

db = MongoEngine()
admin = Admin(name="MozillaDelhi API")
app.secret_key = 'super secret key'

app.config['MONGODB_SETTINGS'] = {'DB':'mozilladelhi', 'HOST':'mongodb://test:test@ds057862.mongolab.com:57862/mozilladelhi'}
# connect(
#     'mozilladelhi',
#     username='test',
#     password='test',
#     port='57862',
#     host='mongodb://test:test@ds057862.mongolab.com:57862/mozilladelhi')

db.init_app(app)
admin.init_app(app)

from server import models
from server import views
from server import administration

# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, models.User, models.Role)
security = Security(app, user_datastore)

# Create a user to test with
@app.before_first_request
def create_user():
    user_datastore.create_user(email='sanyam@zopper.com', password='password')
