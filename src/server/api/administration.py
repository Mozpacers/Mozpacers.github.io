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

    def start_end_date_validation(form, field):
        if field.data > form.event_end_date.data:
            raise ValidationError("Start Date should be earlier than End Date")

    def different_links(form, field):
        if (form.link.data == form.registration_form_link.data) or (form.link.data == form.event_image_link.data) or (form.event_image_link.data == form.registration_form_link.data):
            raise ValidationError("All links should be different")

    form_args = dict(
        title=dict(label='Title', validators=[required()]),
        link=dict(label='Link', validators=[required(), different_links]),
        event_start_date=dict(label='Start Date', validators=[required(), future_events, start_end_date_validation]),
        event_end_date=dict(label='End Date', validators=[required(), future_events]),
        registration_form_link=dict(
            label='Registration Form Link', validators=[required(), different_links]),
        event_image_link=dict(
            label='Event Featured Image Link', validators=[required(), different_links])
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
