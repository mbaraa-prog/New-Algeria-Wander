import django, os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.wilayas.models import Wilaya
from apps.wilayas.serializers import WilayaListSerializer
from apps.blogs.models import Blog
from apps.blogs.serializers import BlogSerializer
from apps.users.serializers import UserProfileSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("WILAYA API OUTPUT")
print("=" * 60)
wilayas = Wilaya.objects.all()[:5]
ws = WilayaListSerializer(wilayas, many=True)
for w in ws.data:
    img = w.get("image")
    status = "OK (Cloudinary)" if img and img.startswith("https://res.cloudinary") else ("NULL" if not img else "BAD: " + str(img)[:60])
    print(f"  [{w['name']}] image => {status}")

print()
print("=" * 60)
print("BLOG API OUTPUT")
print("=" * 60)
blogs = Blog.objects.all()[:5]
bs = BlogSerializer(blogs, many=True)
for b in bs.data:
    img = b.get("image")
    status = "OK (Cloudinary)" if img and img.startswith("https://res.cloudinary") else ("NULL" if not img else "BAD: " + str(img)[:60])
    author_img = b.get("author", {}).get("image")
    auth_status = "OK (Cloudinary)" if author_img and author_img.startswith("https://res.cloudinary") else ("NULL" if not author_img else "BAD: " + str(author_img)[:60])
    print(f"  Blog [{b['title'][:40]}] image => {status} | author.image => {auth_status}")

print()
print("=" * 60)
print("USER / PROFILE API OUTPUT")
print("=" * 60)
users = User.objects.all()[:5]
us = UserProfileSerializer(users, many=True)
for u in us.data:
    img = u.get("image")
    status = "OK (Cloudinary)" if img and img.startswith("https://res.cloudinary") else ("NULL" if not img else "BAD: " + str(img)[:60])
    print(f"  [{u['username']}] image => {status}")

print()
print("=" * 60)

# Final check: any /media/ paths still in DB?
print("DB LEAK CHECK: any remaining /media/ paths?")
print("=" * 60)

from apps.places.models import Place
from apps.events.models import Event
from apps.home.models import HeroSlide

checks = [
    ("Wilaya.cover_image",       Wilaya.objects.exclude(cover_image="").exclude(cover_image__isnull=True)),
    ("Wilaya.external_image_url", Wilaya.objects.filter(external_image_url__startswith="/media/")),
    ("Place.cover_image",         Place.objects.exclude(cover_image="").exclude(cover_image__isnull=True)),
    ("Event.cover_image",         Event.objects.exclude(cover_image="").exclude(cover_image__isnull=True)),
    ("Blog.cover_image",          Blog.objects.exclude(cover_image="").exclude(cover_image__isnull=True)),
    ("HeroSlide.background_image",HeroSlide.objects.exclude(background_image="").exclude(background_image__isnull=True)),
    ("User.avatar",               User.objects.exclude(avatar="").exclude(avatar__isnull=True)),
]

any_leak = False
for label, qs in checks:
    count = qs.count()
    if count:
        print(f"  LEAK [{label}]: {count} record(s) still have legacy paths")
        any_leak = True
    else:
        print(f"  CLEAN [{label}]: 0 records")

if not any_leak:
    print()
    print("ALL CLEAN - no /media/ leaks remain in the database.")
