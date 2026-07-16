from django.db import models
from apps.categories.models import Category


class Wilaya(models.Model):
    """
    Represents an Algerian Wilaya (province/city).
    Seen in: hero carousel, featured destinations, search results, wilaya detail page.
    """
    name            = models.CharField(max_length=100)
    slug            = models.SlugField(unique=True)
    description     = models.TextField()
    short_desc      = models.CharField(max_length=255, blank=True)
    tagline         = models.CharField(max_length=255, blank=True, help_text="e.g. The White City on the Mediterranean")
    cover_image     = models.ImageField(upload_to="wilayas/covers/", blank=True, null=True)
    external_image_url = models.URLField(blank=True, null=True, help_text="Cloudinary or external image URL")
    banner_image    = models.ImageField(upload_to="wilayas/banners/", blank=True, null=True)
    category        = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                        null=True, blank=True, related_name="wilayas")
    # Quick Facts (shown in wilaya detail page sidebar)
    founded         = models.CharField(max_length=50, blank=True, help_text="e.g. 944 AD")
    best_time       = models.CharField(max_length=100, blank=True, help_text="e.g. Spring / Autumn")
    weather_info    = models.CharField(max_length=100, blank=True, help_text="e.g. 24°C Sunny")
    # Tags shown as chips on wilaya page (e.g. #Coastal #History #Culture)
    tags            = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags")
    # Flags
    is_featured     = models.BooleanField(default=False, help_text="Show in featured destinations")
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table  = "wilayas"
        ordering  = ["order", "name"]
        verbose_name_plural = "Wilayas"

    def __str__(self):
        return self.name

    def get_tags_list(self):
        return [t.strip() for t in self.tags.split(",") if t.strip()]


class WilayaImage(models.Model):
    """Extra gallery images for a wilaya (the photo count on the detail page)."""
    wilaya     = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name="images")
    image      = models.ImageField(upload_to="wilayas/gallery/")
    caption    = models.CharField(max_length=255, blank=True)
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "wilaya_images"
        ordering = ["order"]

    def __str__(self):
        return f"{self.wilaya.name} — image {self.id}"
