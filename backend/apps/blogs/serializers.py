from rest_framework import serializers
from .models import Blog, BlogComment


def _get_image(obj):
    """Unified image resolver — always returns external_image_url or None."""
    return obj.external_image_url or None


class AuthorDetailSerializer(serializers.Serializer):
    """Inline author on blog list/detail — exposes unified image field."""
    id       = serializers.IntegerField()
    username = serializers.CharField()
    image    = serializers.SerializerMethodField()

    def get_image(self, obj):
        return obj.external_image_url or None


class BlogCommentSerializer(serializers.ModelSerializer):
    author = AuthorDetailSerializer(read_only=True)

    class Meta:
        model = BlogComment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class BlogSerializer(serializers.ModelSerializer):
    author   = AuthorDetailSerializer(read_only=True)
    comments = BlogCommentSerializer(many=True, read_only=True)
    # Unified contract: always external_image_url or None
    image    = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image', 'author', 'created_at', 'comments']
        read_only_fields = ['id', 'author', 'created_at', 'comments']

    def get_image(self, obj):
        return obj.external_image_url or None


class BlogCreateUpdateSerializer(serializers.ModelSerializer):
    """Write serializer — accepts external_image_url for Cloudinary uploads."""
    class Meta:
        model = Blog
        fields = ['title', 'content', 'external_image_url']


class BlogCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = ['content']
