from django.urls import path
from .views import FavoriteListCreateView, FavoriteDetailView

app_name = "favorites"

urlpatterns = [
    path("",          FavoriteListCreateView.as_view(), name="list_create"),
    path("<int:pk>/", FavoriteDetailView.as_view(),     name="detail"),
]
