from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import HeroSlide
from .serializers import HeroSlideSerializer


class HeroSlidesView(APIView):
    """
    GET /api/home/hero-slides/
    Returns all active hero carousel slides with their featured wilaya cards.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        slides = HeroSlide.objects.filter(is_active=True).prefetch_related(
            "featured_wilayas", "featured_wilayas__category"
        )
        serializer = HeroSlideSerializer(slides, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class HomePageView(APIView):
    """
    GET /api/home/
    Single endpoint that returns everything needed for the homepage in one call:
    - Hero slides
    - Categories
    - Featured wilayas
    - Upcoming events
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        from apps.categories.models import Category
        from apps.categories.serializers import CategorySerializer
        from apps.wilayas.models import Wilaya
        from apps.wilayas.serializers import WilayaListSerializer
        from apps.events.models import Event
        from apps.events.serializers import EventSerializer

        today = timezone.now().date()

        slides    = HeroSlide.objects.filter(is_active=True).prefetch_related(
                        "featured_wilayas", "featured_wilayas__category")
        categories = Category.objects.filter(is_active=True)
        featured   = Wilaya.objects.filter(is_active=True, is_featured=True).select_related("category")[:6]
        upcoming   = Event.objects.filter(is_active=True, end_date__gte=today).select_related("wilaya")[:6]

        return Response({
            "success": True,
            "data": {
                "hero_slides":          HeroSlideSerializer(slides,     many=True, context={"request": request}).data,
                "categories":           CategorySerializer(categories,  many=True, context={"request": request}).data,
                "featured_destinations": WilayaListSerializer(featured, many=True, context={"request": request}).data,
                "upcoming_events":      EventSerializer(upcoming,       many=True, context={"request": request}).data,
            },
        })
