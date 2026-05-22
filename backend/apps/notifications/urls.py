from django.urls import path
from .views import NotificationListView, NotificationMarkReadView

app_name = 'notifications'

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/mark-read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
]
