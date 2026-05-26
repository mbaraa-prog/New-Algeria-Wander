import json
import os
from datetime import date, datetime

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from apps.categories.models import Category
from apps.events.models import Event
from apps.home.models import HeroSlide
from apps.places.models import Place
from apps.wilayas.models import Wilaya

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
    {'slug': 'sahara',    'name': 'Sahara',    'description': 'Sahara desert adventures and dunes.'},
    {'slug': 'beaches',   'name': 'Beaches',   'description': 'Coastal getaways and Mediterranean beaches.'},
    {'slug': 'mountains', 'name': 'Mountains', 'description': 'Mountain escapes and forest trails.'},
    {'slug': 'history',   'name': 'History',   'description': 'Historical sites, museums, and cultural heritage.'},
    {'slug': 'general',   'name': 'General',   'description': 'General attractions and places.'},
]

# Maps a wilaya's JSON 'id' field to the hero slide theme that should use its
# cover image as the slide background.  Edit freely — any wilaya id works.
THEME_TO_WILAYA_ID = {
    'coasts':    'bejaia',
    'desert':    'djanet',
    'mountains': 'bejaia',
    'history':   'constantine',
}


class Command(BaseCommand):
    help = 'Load the Algeria dataset JSON into the database for homepage content.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file-path',
            default=os.path.join(settings.BASE_DIR, 'data', 'algeria_wander_data.json'),
            help='Path to the Algeria dataset JSON file.',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Re-import even if data already exists (clears existing hero slides, wilayas, places, events).',
        )

    # ------------------------------------------------------------------
    # Entry point
    # ------------------------------------------------------------------

    def handle(self, *args, **options):
        file_path = self._resolve_file_path(options['file_path'])

        if HeroSlide.objects.exists() and not options['force']:
            self.stdout.write(self.style.WARNING(
                'Homepage content already exists. Use --force to re-import.'
            ))
            return

        if options['force']:
            self._clear_existing_data()

        data = self._load_json(file_path)

        self.stats = {k: 0 for k in ('categories', 'wilayas', 'landmarks',
                                      'restaurants', 'hotels', 'events', 'hero_slides')}
        self.errors: list[str] = []
        # wilaya_id (from JSON) → raw wilaya dict  (for hero slide image lookup)
        self.wilaya_by_id: dict[str, dict] = {}
        # wilaya slug → Wilaya ORM instance
        self.wilaya_orm: dict[str, Wilaya] = {}

        self.stdout.write(self.style.SUCCESS('Starting Algeria dataset import…'))

        with transaction.atomic():
            categories = self.import_categories()
            default_category = categories.get('general')
            self.import_wilayas(data.get('wilayas', []), default_category)
            self.import_hero_slides()

        self._report_results()

        if self.errors:
            self.stdout.write(self.style.ERROR(
                f'\nImport completed with {len(self.errors)} non-fatal error(s):'
            ))
            for err in self.errors:
                self.stderr.write(self.style.ERROR(f'  ✗ {err}'))
        else:
            self.stdout.write(self.style.SUCCESS('\n✓ Import completed successfully with zero errors!'))

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _resolve_file_path(self, file_path: str) -> str:
        if os.path.exists(file_path):
            return file_path
        fallback = os.path.join(settings.BASE_DIR, 'data', 'algeria_wander_data.json')
        if os.path.exists(fallback):
            self.stdout.write(self.style.WARNING(f'Using fallback JSON: {fallback}'))
            return fallback
        raise CommandError(f'File not found: {file_path}')

    def _load_json(self, file_path: str) -> dict:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as exc:
            raise CommandError(f'Invalid JSON: {exc}')
        wilayas = data.get('wilayas', [])
        if not wilayas:
            raise CommandError('JSON contains no wilayas — aborting.')
        self.stdout.write(self.style.SUCCESS(f'Loaded JSON: {len(wilayas)} wilaya(s) found.'))
        return data

    def _clear_existing_data(self):
        self.stdout.write(self.style.WARNING('--force: clearing existing data…'))
        HeroSlide.objects.all().delete()
        Event.objects.all().delete()
        Place.objects.all().delete()
        Wilaya.objects.all().delete()
        self.stdout.write(self.style.WARNING('  ✓ Cleared hero slides, events, places, wilayas.'))

    # ------------------------------------------------------------------
    # Categories
    # ------------------------------------------------------------------

    def import_categories(self) -> dict:
        categories: dict[str, Category] = {}
        for order, entry in enumerate(CATEGORY_ENTRIES, start=1):
            category, created = Category.objects.get_or_create(
                slug=entry['slug'],
                defaults={
                    'name': entry['name'],
                    'description': entry['description'],
                    'icon': '',
                    'order': order,
                    'is_active': True,
                },
            )
            if not category.image:
                self._save_placeholder(category, f'categories/{category.slug}.png', 'image')
            categories[category.slug] = category
            if created:
                self.stats['categories'] += 1
            self.stdout.write(self.style.SUCCESS(
                f'  {"✓ Created" if created else "· Found"} category: {category.name}'
            ))
        return categories

    # ------------------------------------------------------------------
    # Wilayas
    # ------------------------------------------------------------------

    def import_wilayas(self, wilayas: list, default_category):
        for order, wilaya_data in enumerate(wilayas, start=1):
            name = wilaya_data.get('name', '<unnamed>')
            try:
                self._import_wilaya(wilaya_data, default_category, order)
            except Exception as exc:
                self.errors.append(f"Wilaya '{name}': {exc}")
                self.stderr.write(self.style.ERROR(f"  ✗ Wilaya '{name}' failed: {exc}"))

    def _import_wilaya(self, data: dict, default_category, order: int):
        slug = slugify(data['name'])
        defaults = {
            'name': data['name'],
            'description': data.get('description', ''),
            'tagline': data.get('tagline', ''),
            'short_desc': data.get('description', '')[:255],
            'category': default_category,
            'order': order,
            'is_active': True,
            'is_featured': True,
        }
        wilaya, created = Wilaya.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(wilaya, field, value)
            wilaya.save(update_fields=list(defaults.keys()))

        # Image URL stored in external_image_url field (no local download for production)

        # Track by both slug and original JSON id for hero slide lookup
        wilaya_id = data.get('id', slug)
        self.wilaya_by_id[wilaya_id] = data
        self.wilaya_orm[slug] = wilaya

        self.stats['wilayas'] += 1
        self.stdout.write(self.style.SUCCESS(
            f'  {"✓ Created" if created else "· Updated"} wilaya: {wilaya.name}'
        ))

        self._import_section('landmarks',   data, wilaya, default_category, Place.TYPE_ATTRACTION,  self.stats)
        self._import_section('restaurants', data, wilaya, default_category, Place.TYPE_RESTAURANT,  self.stats)
        self._import_section('hotels',      data, wilaya, default_category, Place.TYPE_HOTEL,       self.stats)
        self._import_events(data.get('events', []), wilaya)

    def _import_section(self, key: str, data: dict, wilaya, default_category,
                         place_type: str, stats: dict):
        items = data.get(key, [])
        if not items:
            self.stdout.write(self.style.WARNING(
                f'    ⚠ No {key} found for wilaya "{wilaya.name}"'
            ))
            return
        stat_key = key if key in stats else key.rstrip('s') + 's'
        for item in items:
            name = item.get('name', '<unnamed>')
            try:
                self._import_place(item, wilaya, default_category, place_type)
                # map section key → stats key
                sk = {'landmarks': 'landmarks', 'restaurants': 'restaurants',
                      'hotels': 'hotels'}.get(key, key)
                self.stats[sk] += 1
            except Exception as exc:
                self.errors.append(f"{key.rstrip('s').capitalize()} '{name}' in '{wilaya.name}': {exc}")
                self.stderr.write(self.style.ERROR(f"    ✗ {key} '{name}' failed: {exc}"))

    def _import_place(self, data: dict, wilaya, default_category, place_type: str):
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
            defaults['opening_hours']  = data.get('opening_hours', '')
            defaults['practical_info'] = data.get('practical_info', '')
        elif place_type == Place.TYPE_RESTAURANT:
            defaults['cuisine']     = data.get('cuisine', '')
            defaults['price_range'] = data.get('price_range', '')
            defaults['must_try']    = data.get('must_try', '')
        elif place_type == Place.TYPE_HOTEL:
            defaults['stars']       = data.get('stars')
            defaults['price_range'] = data.get('price_range', '')
            defaults['highlights']  = data.get('highlights', '')

        place, created = Place.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(place, field, value)
            place.save(update_fields=list(defaults.keys()))

        # Image URL stored in external_image_url field (no local download for production)

        self.stdout.write(self.style.SUCCESS(
            f'    {"✓" if created else "·"} {place_type}: {place.name}'
        ))
        return place

    # ------------------------------------------------------------------
    # Events
    # ------------------------------------------------------------------

    def _import_events(self, events: list, wilaya):
        if not events:
            self.stdout.write(self.style.WARNING(
                f'    ⚠ No events found for wilaya "{wilaya.name}"'
            ))
            return
        for event_data in events:
            name = event_data.get('name', '<unnamed>')
            try:
                self._import_event(event_data, wilaya)
                self.stats['events'] += 1
            except Exception as exc:
                self.errors.append(f"Event '{name}' in '{wilaya.name}': {exc}")
                self.stderr.write(self.style.ERROR(f"    ✗ Event '{name}' failed: {exc}"))

    def _import_event(self, data: dict, wilaya):
        slug = slugify(data['name'])
        start_date, end_date = self._parse_event_dates(data.get('period', ''))

        defaults = {
            'name': data['name'],
            'description': data.get('description', ''),
            'period': data.get('period', ''),
            'wilaya': wilaya,
            'location': data.get('location', wilaya.name),
            'start_date': start_date,
            'end_date': end_date,
            'external_image_url': data.get('image', ''),
            'is_active': True,
        }
        event, created = Event.objects.get_or_create(slug=slug, defaults=defaults)
        if not created:
            for field, value in defaults.items():
                setattr(event, field, value)
            event.save(update_fields=list(defaults.keys()))

        # Image URL stored in external_image_url field (no local download for production)

        self.stdout.write(self.style.SUCCESS(
            f'    {"✓" if created else "·"} event: {event.name} [{data.get("period", "?")}]'
        ))
        return event

    @staticmethod
    def _parse_event_dates(period: str):
        """
        Best-effort parse of human-readable period strings like:
          "August", "October–November", "July", "Muharram (Islamic New Year)"
        Returns (start_date, end_date) as date objects.
        Falls back to today/today if the period is unrecognisable.
        """
        MONTH_MAP = {
            'january': 1, 'february': 2, 'march': 3, 'april': 4,
            'may': 5, 'june': 6, 'july': 7, 'august': 8,
            'september': 9, 'october': 10, 'november': 11, 'december': 12,
        }
        today = date.today()
        year = today.year

        # Normalise separators and clean
        clean = period.lower().replace('–', '-').replace('—', '-')
        # Strip parenthetical notes e.g. "(Islamic New Year)"
        if '(' in clean:
            clean = clean[:clean.index('(')].strip()

        parts = [p.strip() for p in clean.split('-') if p.strip()]
        months = []
        for part in parts:
            for month_name, month_num in MONTH_MAP.items():
                if month_name in part:
                    months.append(month_num)
                    break

        if len(months) == 0:
            return today, today
        if len(months) == 1:
            m = months[0]
            # If the month has already passed this year, target next year
            if m < today.month:
                year += 1
            import calendar
            last_day = calendar.monthrange(year, m)[1]
            return date(year, m, 1), date(year, m, last_day)
        else:
            import calendar
            m_start, m_end = months[0], months[-1]
            if m_start < today.month and m_end < today.month:
                year += 1
            last_day = calendar.monthrange(year, m_end)[1]
            return date(year, m_start, 1), date(year, m_end, last_day)

    # ------------------------------------------------------------------
    # Hero slides
    # ------------------------------------------------------------------

    def import_hero_slides(self):
        # Build an ordered list of Wilaya ORM objects (same order as JSON)
        ordered_wilayas = list(Wilaya.objects.filter(is_active=True).order_by('order', 'name'))

        for index, slide_cfg in enumerate(HERO_SLIDES_CONFIG):
            hero_slide, created = HeroSlide.objects.get_or_create(
                theme=slide_cfg['theme'],
                defaults={
                    'title_prefix':     slide_cfg['title_prefix'],
                    'title_highlight':  slide_cfg['title_highlight'],
                    'title_suffix':     slide_cfg['title_suffix'],
                    'description':      slide_cfg['description'],
                    'highlight_color':  slide_cfg['highlight_color'],
                    'order':            index,
                    'is_active':        True,
                },
            )
            if not created:
                for field, value in {
                    'title_prefix':    slide_cfg['title_prefix'],
                    'title_highlight': slide_cfg['title_highlight'],
                    'title_suffix':    slide_cfg['title_suffix'],
                    'description':     slide_cfg['description'],
                    'highlight_color': slide_cfg['highlight_color'],
                    'order':           index,
                    'is_active':       True,
                }.items():
                    setattr(hero_slide, field, value)
                hero_slide.save()

            # Assign 3 featured wilayas per slide (round-robin, no repeats across slides)
            start = index * 3
            featured = ordered_wilayas[start:start + 3]
            if not featured:
                featured = ordered_wilayas[:3]   # wrap-around for extra slides
            hero_slide.featured_wilayas.set(featured)

            # Background image: prefer the wilaya mapped for this theme
            if not hero_slide.background_image:
                self._assign_hero_background(hero_slide, slide_cfg['theme'])

            self.stats['hero_slides'] += 1
            self.stdout.write(self.style.SUCCESS(
                f'  {"✓ Created" if created else "· Updated"} hero slide: {hero_slide.theme}'
            ))

    def _assign_hero_background(self, hero_slide, theme: str):
        # 1. Try the explicitly mapped wilaya id
        wilaya_id = THEME_TO_WILAYA_ID.get(theme)
        source = self.wilaya_by_id.get(wilaya_id) if wilaya_id else None

        # 2. Fall back to the first featured wilaya's source data
        if not source:
            featured = list(hero_slide.featured_wilayas.all()[:1])
            if featured:
                source = self.wilaya_by_id.get(
                    featured[0].slug,
                    # also try the JSON id stored under the wilaya's slug key
                    next((v for k, v in self.wilaya_by_id.items()
                          if slugify(v.get('name', '')) == featured[0].slug), None)
                )

        background_url = source.get('image') if source else None
        
        # Store background image URL directly (no local download for production)
        if background_url:
            hero_slide.background_image = background_url
            hero_slide.save(update_fields=['background_image'])


    # ------------------------------------------------------------------
    # Reporting
    # ------------------------------------------------------------------

    def _report_results(self):
        self.stdout.write('\n' + self.style.SUCCESS('─' * 50))
        self.stdout.write(self.style.SUCCESS('Import summary:'))
        for key, count in self.stats.items():
            self.stdout.write(self.style.SUCCESS(f'  {key:<14} {count}'))
        self.stdout.write(self.style.SUCCESS('─' * 50))
