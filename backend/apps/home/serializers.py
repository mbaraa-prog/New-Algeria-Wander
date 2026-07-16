from rest_framework import serializers
from .models import HeroSlide
from apps.wilayas.serializers import WilayaListSerializer


class HeroSlideSerializer(serializers.ModelSerializer):
    featured_wilayas = WilayaListSerializer(many=True, read_only=True)
    full_title       = serializers.SerializerMethodField()
    # Unified image contract — always external_image_url or None
    image            = serializers.SerializerMethodField()

    class Meta:
        model  = HeroSlide
        fields = ["id", "theme", "title_prefix", "title_highlight", "title_suffix",
                  "full_title", "description", "image",
                  "highlight_color", "featured_wilayas", "order"]

    def get_full_title(self, obj):
        return f"{obj.title_prefix} {obj.title_highlight} {obj.title_suffix}"

    def get_image(self, obj):
        return obj.external_image_url or None
