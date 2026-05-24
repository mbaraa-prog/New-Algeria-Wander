# Deployment Guide - Algeria Wander API

## Prerequisites

- Python 3.11+
- PostgreSQL 15+ (recommended for production)
- Gunicorn or similar WSGI server
- A deployment platform (Render, Heroku, etc.)

## Environment Variables

Copy `.env.example` to `.env` and configure for your environment:

```bash
# Production Example
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=your-secure-random-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/database_name
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://frontend.yourdomain.com
SECURE_SSL_REDIRECT=True
```

### Generating a Secure SECRET_KEY

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Or use Python:
```python
import secrets
print(secrets.token_urlsafe(50))
```

## Local Development Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create `.env` file for local development:**
   ```bash
   cp .env.example .env
   # Edit .env and set:
   # DJANGO_DEBUG=True
   # USE_SQLITE=True (for local SQLite)
   # DJANGO_SECRET_KEY can remain as default for local dev
   ```

4. **Run migrations:**
   ```bash
   cd backend
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Start development server:**
   ```bash
   python manage.py runserver
   ```

## Deployment on Render.com

### 1. Connect Your Repository
- Go to [render.com](https://render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repository

### 2. Configure Service
- **Name:** `algeria-wander-api`
- **Runtime:** Python 3.11
- **Build Command:** Use the command from `render.yaml`
- **Start Command:** Use the command from `render.yaml`

### 3. Add Environment Variables
In Render dashboard, add:
- `DJANGO_DEBUG` = `False`
- `DJANGO_SECRET_KEY` = [Generate a secure key]
- `ALLOWED_HOSTS` = `yourdomain.onrender.com`
- `CORS_ALLOWED_ORIGINS` = `https://yourdomain.com`
- `DATABASE_URL` = [Will be auto-generated when you add PostgreSQL]
- `SECURE_SSL_REDIRECT` = `True`

### 4. Add PostgreSQL Database
- Click "Database" → "New PostgreSQL"
- Render will automatically set `DATABASE_URL`

### 5. Deploy
- Push changes to main branch
- Render will automatically build and deploy

## Deployment on Heroku

### 1. Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
choco install heroku-cli
```

### 2. Login and Create App
```bash
heroku login
heroku create your-app-name
```

### 3. Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### 4. Set Environment Variables
```bash
heroku config:set DJANGO_DEBUG=False
heroku config:set DJANGO_SECRET_KEY=your-secret-key
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
heroku config:set CORS_ALLOWED_ORIGINS=https://yourdomain.com
heroku config:set SECURE_SSL_REDIRECT=True
```

### 5. Deploy
```bash
git push heroku main
```

### 6. Run Migrations
```bash
heroku run python backend/manage.py migrate
heroku run python backend/manage.py createsuperuser
```

## Production Checklist

- [ ] Set `DJANGO_DEBUG=False`
- [ ] Set a strong `DJANGO_SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` correctly
- [ ] Configure `CORS_ALLOWED_ORIGINS` for frontend domain
- [ ] Use PostgreSQL (not SQLite)
- [ ] Set up database backups
- [ ] Enable HTTPS (configured automatically on Render/Heroku)
- [ ] Test email notifications (if applicable)
- [ ] Set up monitoring/logging
- [ ] Configure static files with WhiteNoise
- [ ] Test API endpoints with frontend domain

## Database Migration

To migrate from MySQL to PostgreSQL:

```bash
# Export data from MySQL
python manage.py dumpdata > data.json

# Switch to PostgreSQL in .env:
# DATABASE_URL=postgresql://user:password@host:5432/db_name

# Load data
python manage.py migrate
python manage.py loaddata data.json
```

## Troubleshooting

### Static Files Not Loading
```bash
# Collect static files
python backend/manage.py collectstatic --noinput
```

### Database Connection Issues
- Verify `DATABASE_URL` format: `postgresql://user:password@host:5432/database`
- Check database credentials
- Ensure firewall allows connection

### CORS Issues
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend domain
- For development: set `DJANGO_DEBUG=True` (allows all origins)

### 500 Error
- Check server logs: `heroku logs --tail` or Render dashboard
- Verify all required environment variables are set
- Run migrations: `heroku run python backend/manage.py migrate`

## Monitoring

### View Logs
**Render:**
```
https://dashboard.render.com/services/your-service
```

**Heroku:**
```bash
heroku logs --tail
```

### Database Backups
- Render: Automatic daily backups included
- Heroku: Set up backups in add-ons

## Security Notes

- Never commit `.env` files
- Always use strong, unique `DJANGO_SECRET_KEY`
- Keep dependencies updated: `pip install --upgrade`
- Use HTTPS in production (automatic on major platforms)
- Regularly review security middleware settings in `settings.py`

## Support

For issues with deployment, check:
- Django documentation: https://docs.djangoproject.com/
- Render docs: https://render.com/docs
- DRF documentation: https://www.django-rest-framework.org/
