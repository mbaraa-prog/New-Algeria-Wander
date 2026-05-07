from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ["user", "wilaya", "place", "rating", "is_active", "created_at"]
    list_filter   = ["rating", "is_active"]
    search_fields = ["user__username", "body"]
    readonly_fields = ["created_at", "updated_at"]
