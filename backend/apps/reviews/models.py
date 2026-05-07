from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings


class Review(models.Model):
    """
    User review — can be linked to a Wilaya or a Place.
    Shown in the 'People's Experiences' section on the wilaya page.
    """
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                   related_name="reviews")
    wilaya     = models.ForeignKey("wilayas.Wilaya", on_delete=models.CASCADE,
                                   null=True, blank=True, related_name="reviews")
    place      = models.ForeignKey("places.Place", on_delete=models.CASCADE,
                                   null=True, blank=True, related_name="reviews")
    rating     = models.PositiveSmallIntegerField(
                     validators=[MinValueValidator(1), MaxValueValidator(5)])
    title      = models.CharField(max_length=200, blank=True)
    body       = models.TextField()
    visit_date = models.CharField(max_length=50, blank=True, help_text="e.g. Visited in June 2023")
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reviews"
        ordering = ["-created_at"]
        # A user can only review a wilaya/place once
        constraints = [
            models.UniqueConstraint(
                fields=["user", "wilaya"],
                condition=models.Q(wilaya__isnull=False),
                name="unique_user_wilaya_review",
            ),
            models.UniqueConstraint(
                fields=["user", "place"],
                condition=models.Q(place__isnull=False),
                name="unique_user_place_review",
            ),
        ]

    def __str__(self):
        target = self.wilaya or self.place
        return f"{self.user.username} → {target} ({self.rating}★)"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update aggregated rating on the place if linked
        if self.place:
            self.place.update_rating()
