from rest_framework import serializers
from .models import Wilaya, WilayaImage
from apps.categories.serializers import CategorySerializer


class WilayaImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WilayaImage
        fields = ["id", "image", "caption", "order"]


class WilayaSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        return obj.external_image_url

    class Meta:
        model = Wilaya
        fields = [
            'id',
            'name',
            'slug',
            'short_desc',
            'tagline',
            'image',   # ONLY THIS, not model field
        ]


class WilayaListSerializer(serializers.ModelSerializer):
    """Lightweight — used in lists, search results, hero carousel."""
    image = serializers.SerializerMethodField()
    category    = CategorySerializer(read_only=True)
    tags_list   = serializers.SerializerMethodField()
    image_count = serializers.SerializerMethodField()

    class Meta:
        model  = Wilaya
        fields = [
            "id", "name", "slug", "short_desc", "tagline", "image",
            "category", "tags_list", "is_featured", "image_count"
        ]

    def get_image(self, obj):
        return obj.external_image_url

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_image_count(self, obj):
        return obj.images.count()


class WilayaDetailSerializer(serializers.ModelSerializer):
    """Full detail — used on the wilaya page."""
    image = serializers.SerializerMethodField()
    category    = CategorySerializer(read_only=True)
    tags_list   = serializers.SerializerMethodField()
    images      = WilayaImageSerializer(many=True, read_only=True)
    image_count = serializers.SerializerMethodField()

    class Meta:
        model  = Wilaya
        fields = ["id", "name", "slug", "description", "short_desc", "tagline",
                  "image", "category",
                  "founded", "best_time", "weather_info",
                  "tags", "tags_list", "images", "image_count",
                  "is_featured", "created_at"]

    def get_image(self, obj):
        return obj.external_image_url

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_image_count(self, obj):
        return obj.images.count()


