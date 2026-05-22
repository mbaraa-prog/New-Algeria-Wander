from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = [
        ("like", "Like"),
        ("comment", "Comment"),
        ("system", "System"),
        ("follow", "Follow"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "notifications"

    def __str__(self):
        return f"{self.user} - {self.type}"
