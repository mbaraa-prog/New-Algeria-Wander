from django.contrib import admin
from .models import HeroSlide


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display  = ["theme", "title_highlight", "order", "is_active"]
    list_editable = ["order", "is_active"]
    filter_horizontal = ["featured_wilayas"]
