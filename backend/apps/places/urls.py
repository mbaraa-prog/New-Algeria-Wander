from django.urls import path
from .views import PlaceListView, PlaceDetailView

app_name = "places"

urlpatterns = [
    path("",         PlaceListView.as_view(),   name="place_list"),
    path("<int:pk>/", PlaceDetailView.as_view(), name="place_detail"),
]
