from django.db import models
from apps.wilayas.models import Wilaya


class HeroSlide(models.Model):
    """
    Hero carousel on the homepage.
    4 slides visible in UI: Coasts, Desert, Mountains, History.
    Each slide shows: bg image, title, highlighted word (colored), description,
    and 2-3 featured wilaya preview cards on the right.
    """
    THEME_CHOICES = [
        ("coasts",    "Coasts"),
        ("desert",    "Desert"),
        ("mountains", "Mountains"),
        ("history",   "History"),
    ]

    theme            = models.CharField(max_length=20, choices=THEME_CHOICES, unique=True)
    # e.g. "Discover the"
    title_prefix     = models.CharField(max_length=100, default="Discover the")
    # The highlighted/colored word e.g. "Desert"
    title_highlight  = models.CharField(max_length=50)
    # e.g. "of Algeria"
    title_suffix     = models.CharField(max_length=100, default="of Algeria")
    description      = models.TextField()
    background_image = models.ImageField(upload_to="hero/", blank=True, null=True)
    external_image_url = models.URLField(blank=True, null=True, help_text="Cloudinary or external image URL")
    # Color applied to the highlighted word (hex or css class name)
    highlight_color  = models.CharField(max_length=30, default="#E86C2C",
                                        help_text="CSS color for highlighted word")
    # 2-3 wilaya preview cards shown on the right side of each slide
    featured_wilayas = models.ManyToManyField(Wilaya, blank=True,
                                              related_name="hero_slides",
                                              help_text="2-3 wilayas shown as cards on the slide")
    order            = models.PositiveIntegerField(default=0)
    is_active        = models.BooleanField(default=True)

    class Meta:
        db_table = "hero_slides"
        ordering = ["order"]

    def __str__(self):
        return f"Slide: {self.theme}"
