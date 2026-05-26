import base64
import json
import os
from datetime import date

import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from apps.categories.models import Category
from apps.events.models import Event
from apps.home.models import HeroSlide
from apps.places.models import Place
from apps.wilayas.models import Wilaya

PLACEHOLDER_IMAGE = base64.b64decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9L6x3gAAAABJRU5ErkJggg=='
)

HERO_SLIDES_CONFIG = [
    {
        'theme': 'coasts',
        'title_prefix': 'Discover the',
        'title_highlight': 'Coasts',
        'title_suffix': 'of Algeria',
        'description': 'Sun-soaked beaches, seaside towns, and Mediterranean culture.',
        'highlight_color': '#2D9CDB',
    },
    {
        'theme': 'desert',
        'title_prefix': 'Discover the',
        'title_highlight': 'Desert',
        'title_suffix': 'of Algeria',
        'description': 'Endless Sahara dunes, oasis villages, and unforgettable nights under the stars.',
        'highlight_color': '#F2994A',
    },
    {
        'theme': 'mountains',
        'title_prefix': 'Discover the',
        'title_highlight': 'Mountains',
        'title_suffix': 'of Algeria',
        'description': 'High-altitude trails, dramatic vistas, and remote mountain villages.',
        'highlight_color': '#27AE60',
    },
    {
        'theme': 'history',
        'title_prefix': 'Discover the',
        'title_highlight': 'History',
        'title_suffix': 'of Algeria',
        'description': 'Ancient ruins, heritage sites, and the stories behind every landmark.',
        'highlight_color': '#9B51E0',
    },
]

CATEGORY_ENTRIES = [
    {'slug': 'sahara', 'name': 'Sahara', 'description': 'Sahara desert adventures and dunes.'},
    {'slug': 'beaches', 'name': 'Beaches', 'description': 'Coastal getaways and Mediterranean beaches.'},
    {'slug': 'mountains', 'name': 'Mountains', 'description': 'Mountain escapes and forest trails.'},
    {'slug': 'history', 'name': 'History', 'description': 'Historical sites, museums, and cultural heritage.'},
    {'slug': 'general', 'name': 'General', 'description': 'General attractions and places.'},
]


class Command(BaseCommand):
    help = 'Load the Algeria dataset JSON into the database for homepage content.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file-path',
            default=os.path.join('backend', 'algeria_data.json'),
            help='Path to the Algeria dataset JSON file.',
        )

    def handle(self, *args, **options):
        file_path = options['file_path']

        if not os.path.exists(file_path):
            fallback = os.path.join('backend', 'data', 'algeria_wander_data.json')
            if os.path.exists(fallback):
                file_path = fallback
                self.stdout.write(self.style.WARNING(f'Using fallback JSON file: {fallback}'))
            else:
                raise CommandError(f'File not found: {file_path}')

        if HeroSlide.objects.exists():
            self.stdout.write(self.style.WARNING('Homepage content already exists. Skipping load_algeria_data.'))
            return

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as exc:
            raise CommandError(f'Invalid JSON: {exc}')

        self.stats = {
            'categories': 0,
            'wilayas': 0,
            'landmarks': 0,
            'restaurants': 0,
            'hotels': 0,
            'events': 0,
            'hero_slides': 0,
        }
        self.errors = []
        self.wilaya_source = {}

        self.stdout.write(self.style.SUCCESS('Starting Algeria dataset import...'))

        with transaction.atomic():
            categories = self.import_categories()
            default_category = categories.get('general')
            self.import_wilayas(data.get('wilayas', []), default_category)
            self.import_hero_slides()

        self.report_results()

        if self.errors:
            self.stdout.write(self.style.ERROR(f'Import completed with {len(self.errors)} errors.'))
            for error in self.errors:
                self.stderr.write(self.style.ERROR(f'  ✗ {error}'))
        else:
            self.stdout.write(self.style.SUCCESS('✓ Import completed successfully!'))

    def import_categories(self):
        categories = {}
        for order, category_data in enumerate(CATEGORY_ENTRIES, start=1):
            category, created = Category.objects.get_or_create(
                slug=category_data['slug'],
                defaults={
                    'name': category_data['name'],
                    'description': category_data['description'],
                    'icon': '',
                    'order': order,
                    'is_active': True,
                },
            )
            if not category.image:
                self.save_placeholder_image(category, f'categories/{category.slug}.png', field_name='image')
            categories[category.slug] = category
            if created:
                self.stats['categories'] += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created category: {category.name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Found category: {category.name}'))

        if 'general' not in categories:
            general, created = Category.objects.get_or_create(
                slug='general',
                defaults={
                    'name': 'General',
                    'description': 'General attractions and places.',
                    'icon': '',
                    'order': len(CATEGORY_ENTRIES) + 1,
                    'is_active': True,
                },
            )
            if not general.image:
                self.save_placeholder_image(general, 'categories/general.png', field_name='image')
            categories['general'] = general
            if created:
                self.stats['categories'] += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created category: {general.name}'))

        return categories

    def import_wilayas(self, wilayas, default_category):
        for wilaya_data in wilayas:
            try:
                self.import_wilaya(wilaya_data, default_category)
            except Exception as exc:
                self.errors.append(f"Wilaya '{wilaya_data.get('name')}' import failed: {exc}")

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

        self.wilaya_source[slug] = data
        self.stats['wilayas'] += 1
        self.stdout.write(self.style.SUCCESS(f'  ✓ {"Created" if created else "Updated"} wilaya: {wilaya.name}'))

        self.import_landmarks(data.get('landmarks', []), wilaya, default_category)
        self.import_restaurants(data.get('restaurants', []), wilaya, default_category)
        self.import_hotels(data.get('hotels', []), wilaya, default_category)
        self.import_events(data.get('events', []), wilaya)

    def import_landmarks(self, landmarks, wilaya, default_category):
        for landmark in landmarks:
            try:
                self.import_place(landmark, wilaya, default_category, Place.TYPE_ATTRACTION)
                self.stats['landmarks'] += 1
            except Exception as exc:
                self.errors.append(f"Landmark '{landmark.get('name')}' import failed: {exc}")

    def import_restaurants(self, restaurants, wilaya, default_category):
        for restaurant in restaurants:
            try:
                self.import_place(restaurant, wilaya, default_category, Place.TYPE_RESTAURANT)
                self.stats['restaurants'] += 1
            except Exception as exc:
                self.errors.append(f"Restaurant '{restaurant.get('name')}' import failed: {exc}")

    def import_hotels(self, hotels, wilaya, default_category):
        for hotel in hotels:
            try:
                self.import_place(hotel, wilaya, default_category, Place.TYPE_HOTEL)
                self.stats['hotels'] += 1
            except Exception as exc:
                self.errors.append(f"Hotel '{hotel.get('name')}' import failed: {exc}")

    def import_place(self, data, wilaya, default_category, place_type):
        slug = slugify(data['name'])
        defaults = {
            'name': data['name'],
            'place_type': place_type,
            'wilaya': wilaya,
            'category': default_category,
            'description': data.get('description', ''),
            'short_desc': data.get('description', '')[:255],
            'address': data.get('address', data.get('location', '')),
            'external_image_url': data.get('image', ''),
            'is_active': True,
        }

        if place_type == Place.TYPE_ATTRACTION:
            defaults['opening_hours'] = data.get('opening_hours', '')
            defaults['practical_info'] = data.get('practical_info', '')
        elif place_type == Place.TYPE_RESTAURANT:
            defaults['cuisine'] = data.get('cuisine', '')
            defaults['price_range'] = data.get('price_range', '')
            defaults['must_try'] = data.get('must_try', '')
        elif place_type == Place.TYPE_HOTEL:
            defaults['stars'] = data.get('stars')
            defaults['price_range'] = data.get('price_range', '')
            defaults['highlights'] = data.get('highlights', '')

        place, created = Place.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(place, field, value)
            place.save(update_fields=list(defaults.keys()))

        if data.get('image') and not place.cover_image:
            self.save_remote_image_to_field(place, 'cover_image', data['image'], f'{slug}_cover.jpg')

        self.stdout.write(self.style.SUCCESS(f'    ✓ {"Created" if created else "Updated"} {place_type}: {place.name}'))
        return place

    def import_events(self, events, wilaya):
        for event_data in events:
            try:
                self.import_event(event_data, wilaya)
                self.stats['events'] += 1
            except Exception as exc:
                self.errors.append(f"Event '{event_data.get('name')}' import failed: {exc}")

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
        active_wilayas = list(Wilaya.objects.filter(is_active=True).order_by('order', 'name')[:6])
        for index, slide_data in enumerate(HERO_SLIDES_CONFIG):
            hero_slide, created = HeroSlide.objects.get_or_create(
                theme=slide_data['theme'],
                defaults={
                    'title_prefix': slide_data['title_prefix'],
                    'title_highlight': slide_data['title_highlight'],
                    'title_suffix': slide_data['title_suffix'],
                    'description': slide_data['description'],
                    'highlight_color': slide_data['highlight_color'],
                    'order': index,
                    'is_active': True,
                },
            )
            if not created:
                for field, value in {
                    'title_prefix': slide_data['title_prefix'],
                    'title_highlight': slide_data['title_highlight'],
                    'title_suffix': slide_data['title_suffix'],
                    'description': slide_data['description'],
                    'highlight_color': slide_data['highlight_color'],
                    'order': index,
                    'is_active': True,
                }.items():
                    setattr(hero_slide, field, value)
                hero_slide.save()

            featured = active_wilayas[index * 2 : index * 2 + 3] or active_wilayas[:3]
            hero_slide.featured_wilayas.set(featured)

            if not hero_slide.background_image:
                background_url = None
                if featured:
                    source = self.wilaya_source.get(featured[0].slug)
                    if source:
                        background_url = source.get('image')
                if background_url:
                    self.save_remote_image_to_field(
                        hero_slide,
                        'background_image',
                        background_url,
                        f'{hero_slide.theme}_background.jpg',
                    )
                else:
                    self.save_placeholder_image(hero_slide, f'hero/{hero_slide.theme}.png', field_name='background_image')

            self.stats['hero_slides'] += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {"Created" if created else "Updated"} hero slide: {hero_slide.theme}'))

    def save_remote_image_to_field(self, instance, field_name, image_url, filename):
        if not image_url:
            return False

        try:
            response = requests.get(image_url, timeout=20)
            response.raise_for_status()
            getattr(instance, field_name).save(filename, ContentFile(response.content), save=True)
            return True
        except Exception as exc:
            self.errors.append(f'Image download failed for {image_url}: {exc}')
            self.stderr.write(self.style.WARNING(f'  ⚠ Failed to download image for {image_url}: {exc}'))
            return False

    def save_placeholder_image(self, instance, filename, field_name='image'):
        getattr(instance, field_name).save(filename, ContentFile(PLACEHOLDER_IMAGE), save=True)

    def report_results(self):
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["categories"]} categories'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["wilayas"]} wilayas'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["landmarks"]} landmarks'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["restaurants"]} restaurants'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["hotels"]} hotels'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["events"]} events'))
        self.stdout.write(self.style.SUCCESS(f'Imported {self.stats["hero_slides"]} hero slides'))
