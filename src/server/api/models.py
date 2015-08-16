from api import db
from flask_security import Security, UserMixin, \
    RoleMixin, login_required, current_user
from datetime import datetime
from flask.ext.security.utils import encrypt_password


class Event(db.Document):
    eid = db.IntField(unique=True)
    title = db.StringField(max_length=100)
    event_start_date = db.DateTimeField()
    event_end_date = db.DateTimeField()
    link = db.URLField(verify_exists=True)
    description = db.StringField(max_length=500)
    venue = db.StringField()
    registration_form_link = db.URLField(verify_exists=True)
    event_image_link = db.URLField(verify_exists=True)

    def __unicode__(self):
        return str(self.eid)

    def get_dict(self):
        return {'eid': self.eid,
                'title': self.title,
                'event_start_date': self.event_start_date,
                'event_end_date': self.event_end_date,
                'link': self.link,
                'description': self.description,
                'venue': self.venue,
                'registration_form_link': self.registration_form_link,
                'event_image_link': self.event_image_link}

    def __repr__(self):
        return 'eid ' + str(self.eid)

    def save(self, *args, **kwargs):
        if self.eid == None:
            try:
                self.eid = self.__class__.objects.order_by('-eid')[0].eid + 1
            except IndexError:
                self.eid = Event.objects.count() + 1

        super(Event, self).save(*args, **kwargs)


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)

    def __unicode__(self):
        return self.name

    def __repr__(self):
        return self.name


class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=500)
    active = db.BooleanField(default=True)
    confirmed_at = db.DateTimeField()
    roles = db.ListField(db.ReferenceField(Role), default=[])

    def save(self, *args, **kwargs):
        self.password = encrypt_password(self.password)
        self.confirmed_at = datetime.now()

        super(User, self).save(*args, **kwargs)
