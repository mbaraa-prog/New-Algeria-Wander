import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_name.settings")
from project_name.utils.init_admin import create_admin_if_not_exists
create_admin_if_not_exists()
application = get_wsgi_application()
