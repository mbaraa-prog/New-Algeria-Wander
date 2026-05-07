from django.contrib import admin
from .models import Place, PlaceImage


class PlaceImageInline(admin.TabularInline):
    model = PlaceImage
    extra = 3


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display        = ["name", "place_type", "wilaya", "category",
                           "avg_rating", "is_top_choice", "is_active"]
    list_filter         = ["place_type", "category", "is_top_choice", "is_active"]
    search_fields       = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    inlines             = [PlaceImageInline]
    readonly_fields     = ["avg_rating", "review_count"]
