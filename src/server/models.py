from server import db

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