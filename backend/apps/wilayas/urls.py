from django.urls import path
from .views import (
    WilayaListView, WilayaFeaturedView, WilayaDetailView,
    WilayaPlacesView, WilayaEventsView, WilayaReviewsView,
)

app_name = "wilayas"

urlpatterns = [
    path("",                    WilayaListView.as_view(),     name="wilaya_list"),
    path("featured/",           WilayaFeaturedView.as_view(), name="wilaya_featured"),
    path("<int:pk>/",           WilayaDetailView.as_view(),   name="wilaya_detail"),
    path("<int:pk>/places/",    WilayaPlacesView.as_view(),   name="wilaya_places"),
    path("<int:pk>/events/",    WilayaEventsView.as_view(),   name="wilaya_events"),
    path("<int:pk>/reviews/",   WilayaReviewsView.as_view(),  name="wilaya_reviews"),
]
