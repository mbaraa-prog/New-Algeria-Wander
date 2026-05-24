web: gunicorn project_name.wsgi:application --bind 0.0.0.0:$PORT --workers 4
release: python backend/manage.py migrate
