from rest_framework import serializers
from .models import Wilaya, WilayaImage
from apps.categories.serializers import CategorySerializer


class WilayaImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WilayaImage
        fields = ["id", "image", "caption", "order"]


class WilayaListSerializer(serializers.ModelSerializer):
    """Lightweight — used in lists, search results, hero carousel."""
    category   = CategorySerializer(read_only=True)
    tags_list  = serializers.SerializerMethodField()
    image_count = serializers.SerializerMethodField()

    class Meta:
        model  = Wilaya
        fields = ["id", "name", "slug", "short_desc", "tagline", "cover_image",
                  "category", "tags_list", "is_featured", "image_count"]

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_image_count(self, obj):
        return obj.images.count()


class WilayaDetailSerializer(serializers.ModelSerializer):
    """Full detail — used on the wilaya page."""
    category   = CategorySerializer(read_only=True)
    tags_list  = serializers.SerializerMethodField()
    images     = WilayaImageSerializer(many=True, read_only=True)
    image_count = serializers.SerializerMethodField()

    class Meta:
        model  = Wilaya
        fields = ["id", "name", "slug", "description", "short_desc", "tagline",
                  "cover_image", "banner_image", "category",
                  "founded", "best_time", "weather_info",
                  "tags", "tags_list", "images", "image_count",
                  "is_featured", "created_at"]

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_image_count(self, obj):
        return obj.images.count()
