from rest_framework import serializers
from .models import Favorite
from apps.places.serializers import PlaceSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    place_details = PlaceSerializer(source="place", read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "user", "place", "place_details", "created_at"]
        read_only_fields = ["user", "created_at"]

class FavoriteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "place"]

    def validate(self, attrs):
        user = self.context["request"].user
        place = attrs["place"]
        if Favorite.objects.filter(user=user, place=place).exists():
            raise serializers.ValidationError("This place is already in your favorites.")
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
