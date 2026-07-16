"""
Directly backfills external_image_url for Wilayas and HeroSlides
from the algeria_data.json dataset — no HTTP downloads, no slow IO.
Run as: python manage.py shell < backfill_wilaya_images.py (or via Get-Content | python manage.py shell)
"""
import json
from django.utils.text import slugify
from apps.wilayas.models import Wilaya
from apps.home.models import HeroSlide

DATA_FILE = "algeria_data.json"

with open(DATA_FILE, encoding="utf-8") as f:
    data = json.load(f)

wilayas_data = data.get("wilayas", [])

print(f"Processing {len(wilayas_data)} wilayas from dataset...")
print("=" * 60)

updated_wilaya = 0
hero_image_map = {}  # slug -> cloudinary url, for hero slide backfill

for wd in wilayas_data:
    slug = slugify(wd["name"])
    img_url = wd.get("image") or None

    if img_url:
        hero_image_map[slug] = img_url

    try:
        w = Wilaya.objects.get(slug=slug)
        if img_url and w.external_image_url != img_url:
            w.external_image_url = img_url
            w.save(update_fields=["external_image_url"])
            updated_wilaya += 1
            print(f"  [UPDATED] {w.name} -> {img_url[:60]}...")
        elif not img_url:
            print(f"  [SKIP]    {wd['name']} has no image in dataset")
        else:
            print(f"  [OK]      {w.name} already has correct URL")
    except Wilaya.DoesNotExist:
        print(f"  [MISS]    {wd['name']} (slug={slug}) not found in DB")

print()
print(f"Wilaya update complete: {updated_wilaya} records updated")
print("=" * 60)

# Now fix HeroSlides — use the first featured wilaya's image per theme
print()
print("Backfilling HeroSlide external_image_url...")

hero_slides = HeroSlide.objects.all()
updated_hero = 0

for slide in hero_slides:
    # Get the first featured wilaya for this slide
    first_wilaya = slide.featured_wilayas.order_by("order").first()
    if first_wilaya and first_wilaya.external_image_url:
        url = first_wilaya.external_image_url
        if slide.external_image_url != url:
            slide.external_image_url = url
            slide.save(update_fields=["external_image_url"])
            updated_hero += 1
            print(f"  [UPDATED] HeroSlide '{slide.theme}' -> {url[:60]}...")
        else:
            print(f"  [OK]      HeroSlide '{slide.theme}' already correct")
    else:
        # Fallback: use any wilaya image from the map
        if hero_image_map:
            url = list(hero_image_map.values())[0]
            slide.external_image_url = url
            slide.save(update_fields=["external_image_url"])
            updated_hero += 1
            print(f"  [FALLBACK] HeroSlide '{slide.theme}' -> {url[:60]}...")
        else:
            print(f"  [SKIP]    HeroSlide '{slide.theme}' has no suitable image")

print()
print(f"HeroSlide update complete: {updated_hero} records updated")
print("=" * 60)

# Final verification
print()
print("FINAL VERIFICATION:")
print(f"  Wilayas with external_image_url: {Wilaya.objects.exclude(external_image_url__isnull=True).exclude(external_image_url='').count()} / {Wilaya.objects.count()}")
print(f"  Wilayas with null image (no Cloudinary): {Wilaya.objects.filter(external_image_url__isnull=True).count()}")
print(f"  HeroSlides with external_image_url: {HeroSlide.objects.exclude(external_image_url__isnull=True).exclude(external_image_url='').count()} / {HeroSlide.objects.count()}")
