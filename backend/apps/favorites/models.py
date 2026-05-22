from django.db import models
from django.conf import settings
from apps.places.models import Place

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "favorites"
        constraints = [
            models.UniqueConstraint(fields=["user", "place"], name="unique_favorite")
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} favorites {self.place}"
