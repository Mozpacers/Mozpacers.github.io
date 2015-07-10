from flask.ext.admin.contrib.mongoengine import ModelView, filters
from flask.ext.admin import Admin, BaseView, expose
from flask_admin.form import rules
from flask.ext.security import current_user, login_required
import server

class EView(ModelView):
    can_create = True
    can_delete = True
    column_list = ('eid', 'title', 'event_date', 'link', 'description')
    decorators = [login_required]

    def is_accessible(self):
        return current_user.is_authenticated()

    # def _handle_view(self, name, **kwargs):
    #     if not self.is_accessible():
    #         return redirect(url_for('login', next=request.url))

server.admin.add_view(EView(server.models.Event))