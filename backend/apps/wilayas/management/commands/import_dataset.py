import base64
import json
import os
from datetime import date

import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from apps.categories.models import Category
from apps.events.models import Event
from apps.home.models import HeroSlide
from apps.places.models import Place
from apps.wilayas.models import Wilaya


CATEGORY_PLACEHOLDER_PNG = base64.b64decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/5+hHgAF5AKj/1voAAAAAElFTkSuQmCC'
)

HERO_SLIDES_CONFIG = [
    {
        "theme": "coasts",
        "title_prefix": "Discover the",
        "title_highlight": "Coasts",
        "title_suffix": "of Algeria",
        "description": "Sun-soaked beaches, seaside towns, and Mediterranean culture.",
        "highlight_color": "#2D9CDB",
    },
    {
        "theme": "desert",
        "title_prefix": "Discover the",
        "title_highlight": "Desert",
        "title_suffix": "of Algeria",
        "description": "Endless Sahara dunes, oasis villages, and unforgettable nights under the stars.",
        "highlight_color": "#F2994A",
    },
    {
        "theme": "mountains",
        "title_prefix": "Discover the",
        "title_highlight": "Mountains",
        "title_suffix": "of Algeria",
        "description": "High-altitude trails, dramatic vistas, and remote mountain villages.",
        "highlight_color": "#27AE60",
    },
    {
        "theme": "history",
        "title_prefix": "Discover the",
        "title_highlight": "History",
        "title_suffix": "of Algeria",
        "description": "Ancient ruins, heritage sites, and the stories behind every landmark.",
        "highlight_color": "#9B51E0",
    },
]

CATEGORY_ENTRIES = [
    {"slug": "sahara", "name": "Sahara", "description": "Sahara desert adventures and dunes."},
    {"slug": "beaches", "name": "Beaches", "description": "Coastal getaways and Mediterranean beaches."},
    {"slug": "mountains", "name": "Mountains", "description": "Mountain escapes and forest trails."},
    {"slug": "history", "name": "History", "description": "Historical sites, museums, and cultural heritage."},
    {"slug": "general", "name": "General", "description": "General attractions and places."},
]


class Command(BaseCommand):
    help = 'Import dataset from JSON file (wilayas, places, events, hero slides, and categories)'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the JSON file')

    def handle(self, *args, **options):
        file_path = options['file_path']

        if not os.path.exists(file_path):
            raise CommandError(f'File not found: {file_path}')

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            raise CommandError(f'Invalid JSON: {e}')

        self.stats = {
            'wilayas': 0,
            'landmarks': 0,
            'restaurants': 0,
            'hotels': 0,
            'events': 0,
            'hero_slides': 0,
            'categories': 0,
        }
        self.errors = []
        self.wilaya_map = {}
        self.wilaya_data_map = {}

        self.stdout.write(self.style.SUCCESS('Starting import...'))

        default_category = self.import_categories()
        self.import_wilayas(data.get('wilayas', []), default_category)
        self.import_hero_slides()
        self.report_stats()

        if self.errors:
            self.stdout.write(self.style.ERROR(f'Import completed with {len(self.errors)} errors.'))
            for error in self.errors:
                self.stderr.write(self.style.ERROR(f'  ✗ {error}'))
        else:
            self.stdout.write(self.style.SUCCESS('✓ Import completed successfully!'))

    def import_categories(self):
        default_category = None
        for index, category_data in enumerate(CATEGORY_ENTRIES, start=1):
            category, created = Category.objects.get_or_create(
                slug=category_data['slug'],
                defaults={
                    'name': category_data['name'],
                    'description': category_data['description'],
                    'icon': '',
                    'order': index,
                    'is_active': True,
                }
            )
            if not category.image:
                self.save_placeholder_image(category, f"categories/{category.slug}.png")
            if created:
                self.stats['categories'] += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created category: {category.name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Existing category: {category.name}'))
            if category.slug == 'general':
                default_category = category

        if default_category is None:
            default_category, _ = Category.objects.get_or_create(
                slug='general',
                defaults={
                    'name': 'General',
                    'description': 'General attractions and places.',
                    'icon': '',
                    'order': len(CATEGORY_ENTRIES) + 1,
                    'is_active': True,
                }
            )
            if not default_category.image:
                self.save_placeholder_image(default_category, 'categories/general.png')
            self.stats['categories'] += 1

        return default_category

    def import_wilayas(self, wilayas, default_category):
        for wilaya_data in wilayas:
            try:
                wilaya = self.import_wilaya(wilaya_data, default_category)
                self.wilaya_map[wilaya_data['id']] = wilaya
                self.wilaya_data_map[wilaya.slug] = wilaya_data
                self.stats['wilayas'] += 1
            except Exception as exc:
                self.errors.append(f"Wilaya '{wilaya_data.get('name')}' import failed: {exc}")

        for wilaya_data in wilayas:
            wilaya = self.wilaya_map.get(wilaya_data['id'])
            if not wilaya:
                continue

            for landmark in wilaya_data.get('landmarks', []):
                try:
                    self.import_landmark(landmark, wilaya, default_category)
                    self.stats['landmarks'] += 1
                except Exception as exc:
                    self.errors.append(f"Landmark '{landmark.get('name')}' import failed: {exc}")

            for restaurant in wilaya_data.get('restaurants', []):
                try:
                    self.import_restaurant(restaurant, wilaya, default_category)
                    self.stats['restaurants'] += 1
                except Exception as exc:
                    self.errors.append(f"Restaurant '{restaurant.get('name')}' import failed: {exc}")

            for hotel in wilaya_data.get('hotels', []):
                try:
                    self.import_hotel(hotel, wilaya, default_category)
                    self.stats['hotels'] += 1
                except Exception as exc:
                    self.errors.append(f"Hotel '{hotel.get('name')}' import failed: {exc}")

            for event_data in wilaya_data.get('events', []):
                try:
                    self.import_event(event_data, wilaya)
                    self.stats['events'] += 1
                except Exception as exc:
                    self.errors.append(f"Event '{event_data.get('name')}' import failed: {exc}")

    def import_wilaya(self, data, default_category):
        slug = slugify(data['name'])
        defaults = {
            'name': data['name'],
            'description': data.get('description', ''),
            'tagline': data.get('tagline', ''),
            'short_desc': data.get('description', '')[:255],
            'category': default_category,
            'is_active': True,
            'is_featured': True,
        }
        wilaya, created = Wilaya.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(wilaya, field, value)
            wilaya.save(update_fields=list(defaults.keys()))

        if data.get('image') and not wilaya.cover_image:
            self.save_remote_image_to_field(wilaya, 'cover_image', data['image'], f'{slug}_cover.jpg')

        self.stdout.write(self.style.SUCCESS(f'  ✓ {"Created" if created else "Updated"} wilaya: {wilaya.name}'))
        return wilaya

    def import_landmark(self, data, wilaya, default_category):
        slug = slugify(data['name'])
        defaults = {
            'name': data['name'],
            'place_type': Place.TYPE_ATTRACTION,
            'wilaya': wilaya,
            'category': default_category,
            'description': data.get('description', ''),
            'short_desc': data.get('description', '')[:255],
            'address': data.get('location', ''),
            'opening_hours': data.get('opening_hours', ''),
            'practical_info': data.get('practical_info', ''),
            'external_image_url': data.get('image', ''),
            'is_active': True,
        }
        place, created = Place.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(place, field, value)
            place.save(update_fields=list(defaults.keys()))

        if data.get('image') and not place.cover_image:
            self.save_remote_image_to_field(place, 'cover_image', data['image'], f'{slug}_cover.jpg')

        self.stdout.write(self.style.SUCCESS(f'    ✓ {"Created" if created else "Updated"} attraction: {place.name}'))
        return place

    def import_restaurant(self, data, wilaya, default_category):
        slug = slugify(data['name'])
        defaults = {
            'name': data['name'],
            'place_type': Place.TYPE_RESTAURANT,
            'wilaya': wilaya,
            'category': default_category,
            'description': data.get('description', ''),
            'short_desc': data.get('description', '')[:255],
            'address': data.get('address', ''),
            'cuisine': data.get('cuisine', ''),
            'price_range': data.get('price_range', ''),
            'must_try': data.get('must_try', ''),
            'external_image_url': data.get('image', ''),
            'is_active': True,
        }
        place, created = Place.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(place, field, value)
            place.save(update_fields=list(defaults.keys()))

        if data.get('image') and not place.cover_image:
            self.save_remote_image_to_field(place, 'cover_image', data['image'], f'{slug}_cover.jpg')

        self.stdout.write(self.style.SUCCESS(f'    ✓ {"Created" if created else "Updated"} restaurant: {place.name}'))
        return place

    def import_hotel(self, data, wilaya, default_category):
        slug = slugify(data['name'])
        defaults = {
            'name': data['name'],
            'place_type': Place.TYPE_HOTEL,
            'wilaya': wilaya,
            'category': default_category,
            'description': data.get('description', ''),
            'short_desc': data.get('description', '')[:255],
            'address': data.get('address', ''),
            'stars': data.get('stars'),
            'price_range': data.get('price_range', ''),
            'highlights': data.get('highlights', ''),
            'external_image_url': data.get('image', ''),
            'is_active': True,
        }
        place, created = Place.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(place, field, value)
            place.save(update_fields=list(defaults.keys()))

        if data.get('image') and not place.cover_image:
            self.save_remote_image_to_field(place, 'cover_image', data['image'], f'{slug}_cover.jpg')

        self.stdout.write(self.style.SUCCESS(f'    ✓ {"Created" if created else "Updated"} hotel: {place.name}'))
        return place

    def import_event(self, data, wilaya):
        slug = slugify(data['name'])
        defaults = {
            'name': data['name'],
            'description': data.get('description', ''),
            'period': data.get('period', ''),
            'wilaya': wilaya,
            'location': data.get('location', wilaya.name),
            'start_date': date.today(),
            'end_date': date.today(),
            'external_image_url': data.get('image', ''),
            'is_active': True,
        }
        event, created = Event.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(event, field, value)
            event.save(update_fields=list(defaults.keys()))

        if data.get('image') and not event.cover_image:
            self.save_remote_image_to_field(event, 'cover_image', data['image'], f'{slug}_cover.jpg')

        self.stdout.write(self.style.SUCCESS(f'    ✓ {"Created" if created else "Updated"} event: {event.name}'))
        return event

    def import_hero_slides(self):
        wilayas = list(self.wilaya_map.values())
        if not wilayas:
            return

        for index, slide_config in enumerate(HERO_SLIDES_CONFIG):
            featured_indexes = range(index * 2, index * 2 + 3)
            featured_wilayas = [wilayas[i] for i in featured_indexes if i < len(wilayas)]
            if not featured_wilayas:
                featured_wilayas = wilayas[:3]

            hero_slide, created = HeroSlide.objects.get_or_create(
                theme=slide_config['theme'],
                defaults={
                    'title_prefix': slide_config['title_prefix'],
                    'title_highlight': slide_config['title_highlight'],
                    'title_suffix': slide_config['title_suffix'],
                    'description': slide_config['description'],
                    'highlight_color': slide_config['highlight_color'],
                    'order': index,
                    'is_active': True,
                }
            )

            for field in ['title_prefix', 'title_highlight', 'title_suffix', 'description', 'highlight_color', 'order', 'is_active']:
                setattr(hero_slide, field, slide_config.get(field, getattr(hero_slide, field)))
            hero_slide.save()

            if not hero_slide.background_image:
                featured_data = self.wilaya_data_map.get(featured_wilayas[0].slug) if featured_wilayas else None
                background_url = featured_data.get('image') if featured_data else None
                if background_url:
                    self.save_remote_image_to_field(hero_slide, 'background_image', background_url, f'{hero_slide.theme}_background.jpg')
                else:
                    self.save_placeholder_image(hero_slide, f'hero/{hero_slide.theme}.png', field_name='background_image')

            hero_slide.featured_wilayas.set(featured_wilayas)
            self.stats['hero_slides'] += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {"Created" if created else "Updated"} hero slide: {hero_slide.theme}'))

    def save_remote_image_to_field(self, instance, field_name, image_url, filename):
        image_data = self.download_image(image_url)
        if not image_data:
            return False

        getattr(instance, field_name).save(filename, ContentFile(image_data), save=True)
        return True

    def save_placeholder_image(self, instance, filename, field_name='image'):
        getattr(instance, field_name).save(filename, ContentFile(CATEGORY_PLACEHOLDER_PNG), save=True)

    def download_image(self, url):
        if not url:
            return None

        try:
            response = requests.get(url, timeout=20)
            if response.status_code != 200:
                raise ValueError(f'HTTP {response.status_code}')
            return response.content
        except Exception as exc:
            self.errors.append(f'Image download failed for {url}: {exc}')
            self.stderr.write(self.style.WARNING(f'  ⚠ Failed to download image: {url} ({exc})'))
            return None

    def report_stats(self):
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["wilayas"]} wilayas'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["landmarks"]} landmarks'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["restaurants"]} restaurants'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["hotels"]} hotels'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["events"]} events'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["hero_slides"]} hero slides'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["categories"]} categories'))
