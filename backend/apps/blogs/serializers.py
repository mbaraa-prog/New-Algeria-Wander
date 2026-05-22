from rest_framework import serializers
from .models import Blog


class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'cover_image', 'author', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class BlogCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'content', 'cover_image']
