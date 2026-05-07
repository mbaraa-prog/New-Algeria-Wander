from django.urls import path
from .views import HeroSlidesView, HomePageView

app_name = "home"

urlpatterns = [
    path("",             HomePageView.as_view(),   name="homepage"),
    path("hero-slides/", HeroSlidesView.as_view(), name="hero_slides"),
]
