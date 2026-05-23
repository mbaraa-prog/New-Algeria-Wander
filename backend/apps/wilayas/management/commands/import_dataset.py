import json
import os
import urllib.request
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify
from django.core.files.base import ContentFile
from apps.wilayas.models import Wilaya
from apps.places.models import Place
from apps.events.models import Event
from apps.categories.models import Category


class Command(BaseCommand):
    help = 'Import dataset from JSON file (wilayas, places, events with Cloudinary URLs)'

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

        self.stdout.write(self.style.SUCCESS('Starting import...'))

        # Get or create default category
        default_category, _ = Category.objects.get_or_create(
            name='General',
            defaults={'slug': 'general', 'description': 'General attractions and places'}
        )

        # Import wilayas
        wilaya_map = {}
        for wilaya_data in data.get('wilayas', []):
            wilaya = self.import_wilaya(wilaya_data, default_category)
            wilaya_map[wilaya_data['id']] = wilaya

        # Import places and events for each wilaya
        for wilaya_data in data.get('wilayas', []):
            wilaya = wilaya_map[wilaya_data['id']]
            
            # Import landmarks as attractions
            for landmark in wilaya_data.get('landmarks', []):
                self.import_landmark(landmark, wilaya, default_category)
            
            # Import restaurants
            for restaurant in wilaya_data.get('restaurants', []):
                self.import_restaurant(restaurant, wilaya, default_category)
            
            # Import hotels
            for hotel in wilaya_data.get('hotels', []):
                self.import_hotel(hotel, wilaya, default_category)
            
            # Import events
            for event in wilaya_data.get('events', []):
                self.import_event(event, wilaya)

        self.stdout.write(self.style.SUCCESS('✓ Import completed successfully!'))

    def import_wilaya(self, data, default_category):
        """Import or update a wilaya."""
        slug = slugify(data['name'])
        
        wilaya, created = Wilaya.objects.update_or_create(
            slug=slug,
            defaults={
                'name': data['name'],
                'description': data['description'],
                'tagline': data.get('tagline', ''),
                'short_desc': data.get('description', '')[:255],
                'category': default_category,
                'is_active': True,
                'is_featured': True,
            }
        )
        
        # Store external image URL if available
        if data.get('image') and not wilaya.cover_image:
            try:
                image_data = urllib.request.urlopen(data['image']).read()
                wilaya.cover_image.save(
                    f'{slug}_cover.jpg',
                    ContentFile(image_data),
                    save=True
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'  ⚠ Failed to download image for {wilaya.name}: {e}'))
        
        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'  ✓ {action} wilaya: {wilaya.name}'))
        return wilaya

    def import_landmark(self, data, wilaya, default_category):
        """Import a landmark as an attraction place."""
        slug = slugify(data['name'])
        
        place, created = Place.objects.update_or_create(
            slug=slug,
            defaults={
                'name': data['name'],
                'place_type': Place.TYPE_ATTRACTION,
                'wilaya': wilaya,
                'category': default_category,
                'description': data['description'],
                'short_desc': data.get('description', '')[:255],
                'address': data.get('location', ''),
                'opening_hours': data.get('opening_hours', ''),
                'practical_info': data.get('practical_info', ''),
                'external_image_url': data.get('image', ''),
                'is_active': True,
            }
        )
        
        # Download and save cover image if available
        if data.get('image') and not place.cover_image:
            try:
                image_data = urllib.request.urlopen(data['image']).read()
                place.cover_image.save(
                    f'{slug}_cover.jpg',
                    ContentFile(image_data),
                    save=True
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    ⚠ Failed to download image for {place.name}: {e}'))
        
        action = 'Created' if created else 'Updated'
        self.stdout.write(f'    ✓ {action} attraction: {place.name}')
        return place

    def import_restaurant(self, data, wilaya, default_category):
        """Import a restaurant place."""
        slug = slugify(data['name'])
        
        place, created = Place.objects.update_or_create(
            slug=slug,
            defaults={
                'name': data['name'],
                'place_type': Place.TYPE_RESTAURANT,
                'wilaya': wilaya,
                'category': default_category,
                'description': data['description'],
                'short_desc': data.get('description', '')[:255],
                'address': data.get('address', ''),
                'cuisine': data.get('cuisine', ''),
                'price_range': data.get('price_range', ''),
                'must_try': data.get('must_try', ''),
                'external_image_url': data.get('image', ''),
                'is_active': True,
            }
        )
        
        # Download and save cover image if available
        if data.get('image') and not place.cover_image:
            try:
                image_data = urllib.request.urlopen(data['image']).read()
                place.cover_image.save(
                    f'{slug}_cover.jpg',
                    ContentFile(image_data),
                    save=True
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    ⚠ Failed to download image for {place.name}: {e}'))
        
        action = 'Created' if created else 'Updated'
        self.stdout.write(f'    ✓ {action} restaurant: {place.name}')
        return place

    def import_hotel(self, data, wilaya, default_category):
        """Import a hotel place."""
        slug = slugify(data['name'])
        
        place, created = Place.objects.update_or_create(
            slug=slug,
            defaults={
                'name': data['name'],
                'place_type': Place.TYPE_HOTEL,
                'wilaya': wilaya,
                'category': default_category,
                'description': data['description'],
                'short_desc': data.get('description', '')[:255],
                'address': data.get('address', ''),
                'stars': data.get('stars'),
                'price_range': data.get('price_range', ''),
                'highlights': data.get('highlights', ''),
                'external_image_url': data.get('image', ''),
                'is_active': True,
            }
        )
        
        # Download and save cover image if available
        if data.get('image') and not place.cover_image:
            try:
                image_data = urllib.request.urlopen(data['image']).read()
                place.cover_image.save(
                    f'{slug}_cover.jpg',
                    ContentFile(image_data),
                    save=True
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    ⚠ Failed to download image for {place.name}: {e}'))
        
        action = 'Created' if created else 'Updated'
        self.stdout.write(f'    ✓ {action} hotel: {place.name}')
        return place

    def import_event(self, data, wilaya):
        """Import an event."""
        slug = slugify(data['name'])
        
        event, created = Event.objects.update_or_create(
            slug=slug,
            defaults={
                'name': data['name'],
                'description': data.get('description', ''),
                'period': data.get('period', ''),
                'wilaya': wilaya,
                'location': data.get('location', wilaya.name),
                'start_date': wilaya.created_at.date(),  # Default to wilaya creation date if missing
                'end_date': wilaya.created_at.date(),
                'external_image_url': data.get('image', ''),
                'is_active': True,
            }
        )
        
        # Download and save cover image if available
        if data.get('image') and not event.cover_image:
            try:
                image_data = urllib.request.urlopen(data['image']).read()
                event.cover_image.save(
                    f'{slug}_cover.jpg',
                    ContentFile(image_data),
                    save=True
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    ⚠ Failed to download image for {event.name}: {e}'))
        
        action = 'Created' if created else 'Updated'
        self.stdout.write(f'    ✓ {action} event: {event.name}')
        return event
