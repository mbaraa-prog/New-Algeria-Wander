from django.db import models
from django.conf import settings


class Blog(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    cover_image = models.ImageField(upload_to='blog_covers/', blank=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blogs')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'blogs'

    def __str__(self):
        return self.title
