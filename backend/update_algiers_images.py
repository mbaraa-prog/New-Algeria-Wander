import os
import json
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_name.settings')
django.setup()

from apps.wilayas.models import Wilaya, WilayaImage
from apps.places.models import Place, PlaceImage
from apps.events.models import Event
from apps.home.models import HeroSlide

OLD_ALGIERS_URL = "https://res.cloudinary.com/df9dmkiuj/image/upload/v1779484617/3501e1681cbb79a207dd824c1f12d6c6_djpnsd.jpg"
NEW_ALGIERS_URL = "https://res.cloudinary.com/df9dmkiuj/image/upload/v1780397008/Alger_cglaox.jpg"

def update_json_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if OLD_ALGIERS_URL in content:
        new_content = content.replace(OLD_ALGIERS_URL, NEW_ALGIERS_URL)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated JSON file: {file_path}")
    else:
        print(f"No occurrences of old Algiers URL in {file_path}")

def update_database():
    # Update Wilaya cover images
    wilayas_updated = Wilaya.objects.filter(external_image_url=OLD_ALGIERS_URL).update(external_image_url=NEW_ALGIERS_URL)
    print(f"Updated {wilayas_updated} Wilayas in DB.")
    
    # Also search by name if any other fields or case-insensitive matches exist
    algiers_wilayas = Wilaya.objects.filter(name__icontains="Algiers")
    for w in algiers_wilayas:
        if w.external_image_url != NEW_ALGIERS_URL:
            old = w.external_image_url
            w.external_image_url = NEW_ALGIERS_URL
            w.save()
            print(f"Updated Algiers Wilaya external_image_url from '{old}' to '{NEW_ALGIERS_URL}'")

    # Update Hero slides
    hero_updated = HeroSlide.objects.filter(external_image_url=OLD_ALGIERS_URL).update(external_image_url=NEW_ALGIERS_URL)
    print(f"Updated {hero_updated} HeroSlides in DB.")
    
    # Update Place
    places_updated = Place.objects.filter(external_image_url=OLD_ALGIERS_URL).update(external_image_url=NEW_ALGIERS_URL)
    print(f"Updated {places_updated} Places in DB.")

if __name__ == "__main__":
    print("Updating JSON files...")
    update_json_file("algeria_data.json")
    update_json_file("data/algeria_wander_data.json")
    update_json_file("data.json")
    
    print("\nUpdating Database...")
    update_database()
    print("\nAll done!")
