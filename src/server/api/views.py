from api import app, db
from flask import (render_template, jsonify, request, redirect, url_for, 
                   Response, make_response)
from models import Event
from flask.ext.security import login_required
import json
from datetime import datetime

result = [] # Global result list to return result as JSON
e = Event() # Global Instance of Event

@app.route('/api/event/getevents/')
@login_required
def get_events():
    '''
    returns all the events with GET request
    '''
    global result
    allEvents = Event.objects.all()
    create_dict(allEvents)
    return Response(json.dumps(result, cls=PythonJSONEncoder), status=200, 
                    content_type="application/json")

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"Error": "Not found"}), 404)


class PythonJSONEncoder(json.JSONEncoder):
    """
    Custom JSON Encoder to encode unsupported data-types to pythonic
    representations.
    """
    def default(self, obj):
        if isinstance(obj, Event):
            return obj.get_dict()
        elif isinstance(obj, datetime):
            return repr(obj.isoformat())
        elif isinstance(obj, datetime.date):
            return repr(obj.isoformat())
        elif isinstance(obj, datetime.time):
            return repr(obj.isoformat())
        else:
        	return repr(obj)
        return super(PythonJSONEncoder, self).default(obj)

def unjsonify(dct):
    if 'eid' in dct:
        dct['eid']=round(eval(dct['eid']), 1)
    return dct

def create_dict(allEvents):
    global result # To store the result of all events
    result = [] # Empty for each call
    for item in allEvents:
        d = {} # To make a dictionary for JSON Response
        d['eid'] = item.eid
        d['title'] = item.title
        d['event_date'] = item.event_date
        d['link'] = item.link
        d['description'] = item.description
        d['venue'] = item.venue
        d['registeration_form_link'] = item.registeration_form_link
        d['event_image_link'] = item.event_image_link
        result.append(d)
    return result