from flask import Flask
from flask.ext.mongoengine import MongoEngine
from pymongo import read_preferences

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')

db = MongoEngine()

app.config['MONGODB_SETTINGS'] = {
	'db': 'MozillaDelhi',
	'host': 'localhost',
	'port': 27017,
	'read_preference': read_preferences.ReadPreference.PRIMARY
	#'username': '2j3mnmsfl',
	#'password': 'slkjf23ns'
}

db.init_app(app)

from server import models
from server import views