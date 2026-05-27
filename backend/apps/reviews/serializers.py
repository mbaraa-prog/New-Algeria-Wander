from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    username  = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    # Unified image contract — always external_image_url or None
    image     = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = ["id", "username", "full_name", "image",
                  "rating", "title", "body", "visit_date", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_image(self, obj):
        return obj.user.external_image_url or None


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Review
        fields = ["rating", "title", "body", "visit_date", "wilaya", "place"]

    def validate(self, attrs):
        if not attrs.get("wilaya") and not attrs.get("place"):
            raise serializers.ValidationError("A review must be linked to a wilaya or a place.")
        if attrs.get("wilaya") and attrs.get("place"):
            raise serializers.ValidationError("Link to either a wilaya or a place, not both.")
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
