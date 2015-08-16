from flask.ext.admin.contrib.mongoengine import ModelView, filters
from flask.ext.admin import Admin, BaseView, expose
from flask_admin.form import rules
from flask.ext.security import current_user, login_required
import api
from wtforms.validators import required, ValidationError
from datetime import datetime


class EView(ModelView):
    can_create = True
    can_delete = True
    can_edit = True
    column_list = ('eid', 'title', 'event_start_date', 'event_end_date', 
                    'link', 'description', 'venue', 'event_image_link', 
                    'registration_form_link')
    decorators = [login_required]
    form_widget_args = {'eid': {'disabled': True}}

    def future_events(form, field):
        if field.data < datetime.now():
            raise ValidationError("Event must only be on some future date")

    form_args = dict(
        title=dict(label='Title', validators=[required()]),
        link=dict(label='Link', validators=[required()]),
        event_start_date=dict(label='Date', validators=[required(), future_events]),
        event_end_date=dict(label='Date', validators=[required(), future_events]),
        registration_form_link=dict(
            label='Registeration Form Link', validators=[required()]),
        event_image_link=dict(
            label='Event Featured Image Link', validators=[required()])
    )

    def is_accessible(self):
        return current_user.has_role("admin") or current_user.has_role("super_admin")


class UView(ModelView):
    can_create = True
    can_delete = True
    can_edit = True
    decorators = [login_required]

    def is_accessible(self):
        return current_user.has_role("super_admin")

api.admin.add_view(EView(api.models.Event))
api.admin.add_view(UView(api.models.User))
