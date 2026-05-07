from django.db import models


class Category(models.Model):
    """
    Discover by Category section on homepage.
    Examples: Sahara, Beaches, Mountains, History
    """
    SLUG_CHOICES = [
        ("sahara",    "Sahara"),
        ("beaches",   "Beaches"),
        ("mountains", "Mountains"),
        ("history",   "History"),
    ]

    name        = models.CharField(max_length=100)
    slug        = models.SlugField(unique=True, choices=SLUG_CHOICES)
    description = models.TextField()
    image       = models.ImageField(upload_to="categories/")
    icon        = models.CharField(max_length=50, blank=True, help_text="CSS icon class or emoji")
    order       = models.PositiveIntegerField(default=0, help_text="Display order")
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table  = "categories"
        ordering  = ["order"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
