import re
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        validators=[validate_password],
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        ]
        extra_kwargs = {
            "email": {"required": True},
            "first_name": {"required": False},
            "last_name": {"required": False},
        }

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

    def validate_username(self, value):
        value = value.strip()
        if not value:
            return value
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long."
            )
        if not re.match(r"^[a-zA-Z0-9_]+$", value):
            raise serializers.ValidationError(
                "Username may only contain letters, numbers, and underscores."
            )
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return attrs

    def _generate_username(self, validated_data):
        first_name = validated_data.get("first_name", "") or ""
        last_name = validated_data.get("last_name", "") or ""
        email = validated_data.get("email", "")

        if first_name or last_name:
            base = (first_name + last_name).strip().lower().replace(" ", "_")
            base = re.sub(r"[^a-z0-9_]+", "", base)
        else:
            base = email.split("@", 1)[0].lower()
            base = re.sub(r"[^a-z0-9_]+", "", base)

        if not base:
            base = "wanderuser"

        username = base
        counter = 1
        while User.objects.filter(username__iexact=username).exists():
            username = f"{base}{counter}"
            counter += 1

        return username

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        username = validated_data.pop("username", None) or self._generate_username(validated_data)
        user = User.objects.create_user(
            email=validated_data["email"],
            username=username,
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login via email + password."""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"},
    )
    remember_me = serializers.BooleanField(required=False, default=False)

    def validate_email(self, value):
        return value.lower().strip()


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for returning user profile data."""

    full_name = serializers.ReadOnlyField()
    # Unified image contract — always external_image_url or None
    image     = serializers.SerializerMethodField()

    class Meta:
    model = User
    fields = [
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "full_name",
        "bio",
        "image",
        "external_image_url",
        "is_active",
        "created_at",
        "updated_at",
    ]
    read_only_fields = ["id", "email", "is_active", "created_at", "updated_at"]

    def get_image(self, obj):
        return obj.external_image_url or None


class TokenResponseSerializer(serializers.Serializer):
    """Shape of the JWT token response."""

    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserProfileSerializer()
