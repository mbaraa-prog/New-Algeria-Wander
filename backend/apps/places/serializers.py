from rest_framework import serializers
from .models import Place, PlaceImage
from apps.categories.serializers import CategorySerializer


class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PlaceImage
        fields = ["id", "image", "caption", "order"]


class PlaceSerializer(serializers.ModelSerializer):
    """Basic place info for nested serializers."""
    category           = CategorySerializer(read_only=True)
    place_type_display = serializers.CharField(source="get_place_type_display", read_only=True)
    wilaya_name        = serializers.CharField(source="wilaya.name", read_only=True)
    # Always return external_image_url only — never expose legacy cover_image paths
    image              = serializers.SerializerMethodField()

    class Meta:
        model  = Place
        fields = ["id", "name", "slug", "place_type", "place_type_display",
                  "wilaya_name", "short_desc", "image", "category",
                  "avg_rating", "review_count", "is_top_choice"]

    def get_image(self, obj):
        return obj.external_image_url or None


class PlaceListSerializer(serializers.ModelSerializer):
    """Lightweight — cards in wilaya tabs and homepage."""
    category           = CategorySerializer(read_only=True)
    place_type_display = serializers.CharField(source="get_place_type_display", read_only=True)
    wilaya_name        = serializers.CharField(source="wilaya.name", read_only=True)
    # Always return external_image_url only — never expose legacy cover_image paths
    image              = serializers.SerializerMethodField()

    class Meta:
        model  = Place
        fields = ["id", "name", "slug", "place_type", "place_type_display",
                  "wilaya_name", "short_desc", "image", "category",
                  "avg_rating", "review_count", "is_top_choice"]

    def get_image(self, obj):
        return obj.external_image_url or None


class PlaceDetailSerializer(serializers.ModelSerializer):
    """Full detail."""
    category           = CategorySerializer(read_only=True)
    images             = PlaceImageSerializer(many=True, read_only=True)
    place_type_display = serializers.CharField(source="get_place_type_display", read_only=True)
    wilaya_name        = serializers.CharField(source="wilaya.name", read_only=True)
    wilaya_id          = serializers.IntegerField(source="wilaya.id", read_only=True)
    # Always return external_image_url only — never expose legacy cover_image paths
    image              = serializers.SerializerMethodField()

    class Meta:
        model  = Place
        fields = ["id", "name", "slug", "place_type", "place_type_display",
                  "wilaya_id", "wilaya_name", "category",
                  "description", "short_desc", "image", "images",
                  "address", "avg_rating", "review_count", "is_top_choice",
                  "cuisine", "price_range", "must_try",
                  "stars", "highlights",
                  "opening_hours", "practical_info",
                  "created_at"]

    def get_image(self, obj):
        return obj.external_image_url or None
