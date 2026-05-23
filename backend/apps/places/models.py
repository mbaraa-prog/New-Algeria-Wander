from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.wilayas.models import Wilaya
from apps.categories.models import Category


class Place(models.Model):
    """
    A tourist place — attraction, hotel, or restaurant.
    Shown in: wilaya tabs (Things to Do / Hotels / Restaurants),
              category filter on homepage, places list.
    """
    TYPE_ATTRACTION = "attraction"
    TYPE_HOTEL      = "hotel"
    TYPE_RESTAURANT = "restaurant"

    PLACE_TYPE_CHOICES = [
        (TYPE_ATTRACTION, "Attraction / Things to Do"),
        (TYPE_HOTEL,      "Hotel / Place to Stay"),
        (TYPE_RESTAURANT, "Restaurant / Place to Eat"),
    ]

    name         = models.CharField(max_length=200)
    slug         = models.SlugField(unique=True)
    place_type   = models.CharField(max_length=20, choices=PLACE_TYPE_CHOICES,
                                    default=TYPE_ATTRACTION)
    wilaya       = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name="places")
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                     null=True, blank=True, related_name="places")
    description  = models.TextField()
    short_desc   = models.CharField(max_length=255, blank=True)
    cover_image  = models.ImageField(upload_to="places/covers/")
    external_image_url = models.URLField(blank=True, null=True, help_text="Cloudinary or external image URL")
    address      = models.CharField(max_length=300, blank=True)
    
    # For restaurants
    cuisine      = models.CharField(max_length=100, blank=True, help_text="e.g. Algerian, Mediterranean")
    price_range  = models.CharField(max_length=10, blank=True, help_text="e.g. $, $$, $$$")
    must_try     = models.TextField(blank=True, help_text="Recommended dishes, comma-separated")
    
    # For hotels
    stars        = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    highlights   = models.TextField(blank=True, help_text="Key amenities/highlights, comma-separated")
    
    # For attractions
    opening_hours = models.CharField(max_length=255, blank=True, help_text="e.g. Daily 9:00-17:00")
    practical_info = models.TextField(blank=True, help_text="Visitor information and tips")
    # Rating (aggregated, stored for performance)
    avg_rating   = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    review_count = models.PositiveIntegerField(default=0)
    # Flags
    is_top_choice = models.BooleanField(default=False, help_text="Show TOP CHOICE badge")
    is_active     = models.BooleanField(default=True)
    order         = models.PositiveIntegerField(default=0)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "places"
        ordering = ["-is_top_choice", "order", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_place_type_display()})"

    def update_rating(self):
        """Recalculate avg_rating and review_count from related reviews."""
        from apps.reviews.models import Review
        reviews = Review.objects.filter(place=self)
        self.review_count = reviews.count()
        if self.review_count:
            total = sum(r.rating for r in reviews)
            self.avg_rating = round(total / self.review_count, 2)
        else:
            self.avg_rating = 0
        self.save(update_fields=["avg_rating", "review_count"])


class PlaceImage(models.Model):
    place   = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="images")
    image   = models.ImageField(upload_to="places/gallery/")
    caption = models.CharField(max_length=255, blank=True)
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "place_images"
        ordering = ["order"]
