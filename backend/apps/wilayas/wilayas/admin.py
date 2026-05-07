from django.contrib import admin
from .models import Wilaya, WilayaImage


class WilayaImageInline(admin.TabularInline):
    model = WilayaImage
    extra = 3


@admin.register(Wilaya)
class WilayaAdmin(admin.ModelAdmin):
    list_display        = ["name", "category", "is_featured", "is_active", "order"]
    list_editable       = ["is_featured", "is_active", "order"]
    list_filter         = ["category", "is_featured", "is_active"]
    search_fields       = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    inlines             = [WilayaImageInline]


@admin.register(WilayaImage)
class WilayaImageAdmin(admin.ModelAdmin):
    list_display = ["wilaya", "caption", "order"]
