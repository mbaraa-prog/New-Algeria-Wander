import os
import json
from django.db import migrations
from django.utils.text import slugify

def backfill_wilaya_images(apps, schema_editor):
    Wilaya = apps.get_model("wilayas", "Wilaya")
    
    # Resolve the path to algeria_data.json relative to backend dir or root
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    fpath = os.path.join(base_dir, "algeria_data.json")
    
    if not os.path.exists(fpath):
        fpath = "algeria_data.json"
        if not os.path.exists(fpath):
            fpath = os.path.join("backend", "algeria_data.json")
            if not os.path.exists(fpath):
                return
                
    try:
        with open(fpath, encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return
        
    wilayas_data = data.get("wilayas", [])
    for wd in wilayas_data:
        slug = slugify(wd["name"])
        img_url = wd.get("image") or None
        if img_url:
            Wilaya.objects.filter(slug=slug).update(external_image_url=img_url)

def reverse_backfill(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ("wilayas", "0003_add_external_image_url_to_wilaya"),
    ]

    operations = [
        migrations.RunPython(backfill_wilaya_images, reverse_backfill),
    ]
