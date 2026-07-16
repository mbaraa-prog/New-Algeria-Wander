import os
import sys

# Ensure the venv site-packages is first in sys.path
venv_site = os.path.join(os.path.dirname(__file__), 'venv', 'Lib', 'site-packages')
if os.path.exists(venv_site):
    sys.path.insert(0, venv_site)
sys.path.insert(0, os.path.dirname(__file__))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_name.settings')
django.setup()

from apps.home.models import HeroSlide
from apps.home.serializers import HeroSlideSerializer

from django.test import RequestFactory
factory = RequestFactory()
request = factory.get('/api/home/')

slides = HeroSlide.objects.filter(is_active=True).prefetch_related(
    "featured_wilayas", "featured_wilayas__category"
)
serializer = HeroSlideSerializer(slides, many=True, context={"request": request})
print("Serialized slides:")
for s in serializer.data:
    print(s)
