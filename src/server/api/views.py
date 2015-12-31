from api import app, db
from flask import (render_template, jsonify, request, redirect, url_for,
                   Response, make_response)
from models import Event
from flask.ext.security import login_required
import json
from datetime import datetime
from os import environ
import requests
from mongoengine.queryset import DoesNotExist

e = Event()  # Global Instance of Event

@app.route('/')
def api_admin_panel_home():
    '''
    Redirect root to admin panel
    '''
    return redirect('/admin')


@app.route('/api/events/')
def get_events():
    '''
    returns all the events with GET request
    '''
    time = request.args.get('time')
    limit = request.args.get('limit')
    if not limit:
        # Default limit 3 for HomePage
        limit = 3
    if limit:
        try:
            limit = int(limit)
        except:
            return make_response(jsonify({"Message":
                                          "Limit should be an integer"}), 400)
    if time == "past":
        allEvents = Event.objects.filter(
            event_start_date__lte=datetime.now()).limit(limit)
    elif time == "future":
        allEvents = Event.objects.filter(
            event_start_date__gt=datetime.now()).limit(limit)
    elif (time) and not (time == "past" or time == "future"):
        return make_response(jsonify({"Message":
                                      "Time should be past or future"}), 400)
    else:
        allEvents = Event.objects.all().limit(limit)
    result = create_dict(allEvents)
    return Response(json.dumps(result, cls=PythonJSONEncoder), status=200,
                    content_type="application/json")


@app.route('/api/events/<int:event_id>')
@app.route('/api/events/<int:event_id>/')
def get_single_event(event_id):
    '''
    Get a single event with given event_id
    '''
    try:
        singleEvent = Event.objects.get(eid=event_id)
        result = create_single_event_dict(singleEvent)
    except DoesNotExist:
        return Response(json.dumps({"Message": "Event not found"}), status=404,
                        content_type="application/json")
    return Response(json.dumps(result, cls=PythonJSONEncoder), status=200,
                    content_type="application/json")


@app.route('/api/send-contact-us-form/', methods=['GET', 'POST'])
def send_simple_message():
    '''
    Collects info from contact-us form on mozpacers.org
    and sends the mail to Mozpacers mail
    POST Request with JSON body
    :name : Name of User
    :email : Email of User
    :message : Message given by User
    '''
    if request.method == 'POST':
        try:
            json_response = json.loads(request.data)
        except:
            return Response(json.dumps({"Message": "No JSON request found."}), 
                                            status=400,
                                            content_type="application/json")
        try:
            name = json_response['name']
            email = json_response['email']
            message = json_response['message']
        except KeyError:
            return Response(json.dumps({"Message": "In-complete information. Cannot send mail."}), 
                                status=400,
                                content_type="application/json")
        subject = 'Contact Us | MozPacers : Response from ' + name
        requests.post(
            environ["MAIL_ADDRESS"],
            auth=("api", environ["API_KEY"]),
            data={"from": environ["MAIL_FROM"],
                  "to": environ["MAIL_TO"],
                  "subject": 'Contact Us | MozPacers : Response from ' + name,
                  "text": name + ' with mail id: ' + email + ' just filled the' + \
                          ' contact-us form on MozPacers.org with message: ' + message})
        return Response(json.dumps({"Message": "Email Sent successfully"}), status=200,
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
            return obj.isoformat()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        elif isinstance(obj, datetime.time):
            return obj.isoformat()
        else:
            return repr(obj)
        return super(PythonJSONEncoder, self).default(obj)


def unjsonify(dct):
    if 'eid' in dct:
        dct['eid'] = round(eval(dct['eid']), 1)
    return dct


def create_dict(allEvents):
    result = []  # Empty for each call
    for item in allEvents:
        d = {}  # To make a dictionary for JSON Response
        d['eid'] = item.eid
        d['title'] = item.title
        d['event_start_date'] = item.event_start_date
        d['event_end_date'] = item.event_end_date
        d['link'] = item.link
        d['description'] = item.description
        d['venue'] = item.venue
        d['registration_form_link'] = item.registration_form_link
        d['event_image_link'] = item.event_image_link
        result.append(d)
    return result

def create_single_event_dict(SingleEvent):
    d = {}  # To make a dictionary for JSON Response
    d['eid'] = SingleEvent.eid
    d['title'] = SingleEvent.title
    d['event_start_date'] = SingleEvent.event_start_date
    d['event_end_date'] = SingleEvent.event_end_date
    d['link'] = SingleEvent.link
    d['description'] = SingleEvent.description
    d['venue'] = SingleEvent.venue
    d['registration_form_link'] = SingleEvent.registration_form_link
    d['event_image_link'] = SingleEvent.event_image_link
    return d
