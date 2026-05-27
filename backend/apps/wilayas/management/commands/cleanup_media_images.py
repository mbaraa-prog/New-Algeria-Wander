"""
Management command: cleanup_media_images
----------------------------------------
Scans Wilaya, Place, and Event records.
If cover_image still holds a legacy /media/... local path
(i.e. NOT an external http/https URL), it is cleared to NULL.

Usage:
    python manage.py cleanup_media_images          # dry-run (default)
    python manage.py cleanup_media_images --apply  # apply changes
"""

from django.core.management.base import BaseCommand
from apps.wilayas.models import Wilaya
from apps.places.models import Place
from apps.events.models import Event


def is_legacy_media_path(value):
    """
    Returns True when value is a relative /media/... path.
    A proper Cloudinary URL starts with http/https — those are safe.
    An empty / None value is also safe (nothing to fix).
    """
    if not value:
        return False
    s = str(value)
    # Starts with http/https → external URL → safe
    if s.startswith("http://") or s.startswith("https://"):
        return False
    # Anything else (relative path like "wilayas/covers/...", "/media/...", etc.) → legacy
    return True


MODELS = [
    ("Wilaya", Wilaya, ["cover_image", "banner_image"]),
    ("Place",  Place,  ["cover_image"]),
    ("Event",  Event,  ["cover_image"]),
]


class Command(BaseCommand):
    help = (
        "Clears legacy /media/... cover_image paths from the database. "
        "Run with --apply to persist changes."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            default=False,
            help="Actually write the changes to the database (default: dry-run only).",
        )

    def handle(self, *args, **options):
        apply = options["apply"]

        if not apply:
            self.stdout.write(
                self.style.WARNING("DRY-RUN mode — no changes will be saved. Pass --apply to persist.")
            )
        else:
            self.stdout.write(self.style.SUCCESS("APPLY mode — changes WILL be written to the database."))

        self.stdout.write("")

        total_fixed = 0

        for model_name, Model, fields in MODELS:
            self.stdout.write(self.style.MIGRATE_HEADING(f"-- {model_name} --------------------------"))

            model_fixed = 0
            for obj in Model.objects.all():
                changed_fields = []

                for field in fields:
                    raw = getattr(obj, field, None)
                    # ImageField returns the FieldFile; .name is the stored string
                    stored = raw.name if hasattr(raw, "name") else raw

                    if is_legacy_media_path(stored):
                        ext_url = getattr(obj, "external_image_url", None)
                        self.stdout.write(
                            f"  [{model_name} id={obj.pk}] {field} = '{stored}'"
                            + (f"  ->  external_image_url = '{ext_url}'" if ext_url else "  ->  external_image_url is EMPTY")
                        )
                        setattr(obj, field, None)  # clear the legacy path
                        changed_fields.append(field)

                if changed_fields and apply:
                    # Use update_fields for efficiency; avoid full model save
                    obj.save(update_fields=changed_fields)
                    model_fixed += len(changed_fields)
                elif changed_fields:
                    model_fixed += len(changed_fields)

            if model_fixed:
                self.stdout.write(
                    self.style.SUCCESS(f"  -> {model_fixed} legacy field(s) {'cleared' if apply else 'would be cleared'}.")
                )
            else:
                self.stdout.write(self.style.SUCCESS("  -> No legacy media paths found. All clean."))

            self.stdout.write("")
            total_fixed += model_fixed

        self.stdout.write("=" * 42)
        if apply:
            self.stdout.write(
                self.style.SUCCESS(f"Done. {total_fixed} legacy cover_image field(s) cleared from the database.")
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"Dry-run complete. {total_fixed} field(s) would be cleared. "
                    "Re-run with --apply to commit."
                )
            )
