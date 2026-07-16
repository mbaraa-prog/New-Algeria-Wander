from django.contrib import admin
from .models import Blog, BlogComment


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at', 'author')
    readonly_fields = ('created_at',)


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ('blog', 'author', 'created_at')
    search_fields = ('content',)
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)
