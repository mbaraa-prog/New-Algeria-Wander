"""
Management command: backfill_wilaya_images
Reads algeria_data.json and writes external_image_url for Wilayas.
"""
import json
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.wilayas.models import Wilaya


class Command(BaseCommand):
    help = "Backfill Wilaya.external_image_url from algeria_data.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            default="algeria_data.json",
            help="Path to the dataset JSON file (default: algeria_data.json)",
        )

    def handle(self, *args, **options):
        fpath = options["file"]
        with open(fpath, encoding="utf-8") as f:
            data = json.load(f)

        wilayas_data = data.get("wilayas", [])
        self.stdout.write(f"Processing {len(wilayas_data)} wilayas from {fpath}...")

        updated = 0
        for wd in wilayas_data:
            slug = slugify(wd["name"])
            img_url = wd.get("image") or None

            try:
                w = Wilaya.objects.get(slug=slug)
                if img_url and w.external_image_url != img_url:
                    w.external_image_url = img_url
                    w.save(update_fields=["external_image_url"])
                    updated += 1
                    self.stdout.write(self.style.SUCCESS(
                        f"  UPDATED {w.name} -> {img_url[:70]}..."
                    ))
                elif img_url:
                    self.stdout.write(f"  OK      {w.name} already set")
                else:
                    self.stdout.write(self.style.WARNING(
                        f"  SKIP    {wd['name']} has no image in dataset"
                    ))
            except Wilaya.DoesNotExist:
                self.stdout.write(self.style.ERROR(
                    f"  MISS    {wd['name']} (slug={slug}) not in DB"
                ))

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Done. {updated} Wilayas updated with Cloudinary URLs."
        ))

        # Print final counts
        total = Wilaya.objects.count()
        with_url = Wilaya.objects.exclude(
            external_image_url__isnull=True
        ).exclude(external_image_url="").count()
        self.stdout.write(f"Wilayas with image: {with_url}/{total}")
        if with_url < total:
            self.stdout.write(self.style.WARNING(
                f"WARNING: {total - with_url} wilayas still have null images!"
            ))
        else:
            self.stdout.write(self.style.SUCCESS("All wilayas have Cloudinary images."))
