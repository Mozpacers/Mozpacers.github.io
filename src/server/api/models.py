from api import db
from flask_security import Security, UserMixin, RoleMixin, login_required, current_user

class Event(db.Document):
    eid = db.IntField(unique=True)
    title = db.StringField()
    event_date = db.DateTimeField()
    link = db.StringField()
    description = db.StringField()
    venue = db.StringField()

    def __unicode__(self):
        return str(self.eid)

    def get_dict(self):
        return { 'eid': self.eid,
                 'title': self.title,
                 'event_date': self.event_date,
                 'link': self.link,
                 'description': self.description}

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

class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    confirmed_at = db.DateTimeField()
    roles = db.ListField(db.ReferenceField(Role), default=[])

# class User(db.Document):
#     login = db.StringField(max_length=80, unique=True)
#     email = db.StringField(max_length=120)
#     password = db.StringField(max_length=64)

#     # Flask-Login integration
#     def is_authenticated(self):
#         return True

#     def is_active(self):
#         return True

#     def is_anonymous(self):
#         return False

#     def get_id(self):
#         return str(self.id)

#     # Required for administrative interface
#     def __unicode__(self):
#         return self.login
