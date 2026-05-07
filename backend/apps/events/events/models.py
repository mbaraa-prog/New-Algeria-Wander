from django.db import models
from apps.wilayas.models import Wilaya


class Event(models.Model):
    """
    Upcoming events — shown on homepage and wilaya detail page.
    Examples: Timgad Music Festival, Sahara Desert Marathon, Algerian Cuisine Festival
    """
    name        = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="events/", blank=True, null=True)
    wilaya      = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name="events")
    location    = models.CharField(max_length=255, help_text="Venue name, e.g. Timgad, Batna")
    start_date  = models.DateField()
    end_date    = models.DateField()
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "events"
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.name} ({self.start_date})"
