from rest_framework import serializers
from .models import Blog, BlogComment


class AuthorDetailSerializer(serializers.Serializer):
    """Serializer for blog author details including profile picture."""
    id = serializers.IntegerField()
    username = serializers.CharField()
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class BlogCommentSerializer(serializers.ModelSerializer):
    author = AuthorDetailSerializer(read_only=True)

    class Meta:
        model = BlogComment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class BlogSerializer(serializers.ModelSerializer):
    author = AuthorDetailSerializer(read_only=True)
    comments = BlogCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'cover_image', 'author', 'created_at', 'comments']
        read_only_fields = ['id', 'author', 'created_at', 'comments']


class BlogCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'content', 'cover_image']


class BlogCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = ['content']
