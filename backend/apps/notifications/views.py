from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer, NotificationReadSerializer


class NotificationListView(generics.ListAPIView):
    """Return notifications for the authenticated user."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkReadView(generics.UpdateAPIView):
    """Mark a single notification as read (PATCH)."""

    serializer_class = NotificationReadSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
