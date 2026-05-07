from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Wilaya
from .serializers import WilayaListSerializer, WilayaDetailSerializer


class WilayaListView(APIView):
    """GET /api/wilayas/"""

    def get(self, request):
        qs = Wilaya.objects.filter(is_active=True).select_related("category")
        # Optional filter by category slug
        category = request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)
        serializer = WilayaListSerializer(qs, many=True, context={"request": request})
        return Response({"success": True, "count": qs.count(), "data": serializer.data})


class WilayaFeaturedView(APIView):
    """GET /api/wilayas/featured/  — for homepage featured destinations section"""

    def get(self, request):
        qs = Wilaya.objects.filter(is_active=True, is_featured=True).select_related("category")[:6]
        serializer = WilayaListSerializer(qs, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class WilayaDetailView(APIView):
    """GET /api/wilayas/<id>/"""

    def get(self, request, pk):
        wilaya = get_object_or_404(Wilaya, pk=pk, is_active=True)
        serializer = WilayaDetailSerializer(wilaya, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class WilayaPlacesView(APIView):
    """
    GET /api/wilayas/<id>/places/
    Returns places for a wilaya split by type (Things to Do / Hotels / Restaurants).
    Supports ?type=attraction|hotel|restaurant query param.
    """

    def get(self, request, pk):
        from apps.places.models import Place
        from apps.places.serializers import PlaceListSerializer

        wilaya = get_object_or_404(Wilaya, pk=pk, is_active=True)
        place_type = request.query_params.get("type")

        qs = Place.objects.filter(wilaya=wilaya, is_active=True).select_related("category")
        if place_type:
            qs = qs.filter(place_type=place_type)

        # Group by type for the tabbed layout
        def get_by_type(t):
            return PlaceListSerializer(
                qs.filter(place_type=t), many=True, context={"request": request}
            ).data

        if place_type:
            return Response({"success": True, "data": PlaceListSerializer(qs, many=True, context={"request": request}).data})

        return Response({
            "success": True,
            "wilaya": wilaya.name,
            "data": {
                "attractions": get_by_type("attraction"),
                "hotels":      get_by_type("hotel"),
                "restaurants": get_by_type("restaurant"),
            },
        })


class WilayaEventsView(APIView):
    """GET /api/wilayas/<id>/events/"""

    def get(self, request, pk):
        from apps.events.models import Event
        from apps.events.serializers import EventSerializer

        wilaya = get_object_or_404(Wilaya, pk=pk, is_active=True)
        qs = Event.objects.filter(wilaya=wilaya, is_active=True).order_by("start_date")
        from apps.events.serializers import EventSerializer
        return Response({
            "success": True,
            "wilaya": wilaya.name,
            "data": EventSerializer(qs, many=True, context={"request": request}).data,
        })


class WilayaReviewsView(APIView):
    """GET /api/wilayas/<id>/reviews/"""

    def get(self, request, pk):
        from apps.reviews.models import Review
        from apps.reviews.serializers import ReviewSerializer

        wilaya = get_object_or_404(Wilaya, pk=pk, is_active=True)
        qs = Review.objects.filter(wilaya=wilaya).select_related("user").order_by("-created_at")
        return Response({
            "success": True,
            "wilaya": wilaya.name,
            "count": qs.count(),
            "data": ReviewSerializer(qs, many=True, context={"request": request}).data,
        })
