from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    wilaya_name = serializers.CharField(source="wilaya.name", read_only=True)
    wilaya_id   = serializers.IntegerField(source="wilaya.id", read_only=True)
    date_range  = serializers.SerializerMethodField()

    class Meta:
        model  = Event
        fields = ["id", "name", "slug", "description", "period", "cover_image", "external_image_url",
                  "wilaya_id", "wilaya_name", "location",
                  "start_date", "end_date", "date_range"]

    def get_date_range(self, obj):
        """Returns formatted range like 'July 15-20, 2026'."""
        if obj.start_date.month == obj.end_date.month and obj.start_date.year == obj.end_date.year:
            return f"{obj.start_date.strftime('%B')} {obj.start_date.day}–{obj.end_date.day}, {obj.start_date.year}"
        return f"{obj.start_date.strftime('%b %d')} – {obj.end_date.strftime('%b %d, %Y')}"
