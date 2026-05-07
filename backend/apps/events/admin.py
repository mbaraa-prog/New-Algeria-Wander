from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display        = ["name", "wilaya", "location", "start_date", "end_date", "is_active"]
    list_filter         = ["is_active", "wilaya"]
    search_fields       = ["name", "location"]
    prepopulated_fields = {"slug": ("name",)}
    date_hierarchy      = "start_date"
