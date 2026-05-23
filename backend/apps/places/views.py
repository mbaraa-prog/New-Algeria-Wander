from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Place
from .serializers import PlaceDetailSerializer, PlaceListSerializer


class PlaceListView(APIView):
    """
    GET /api/places/
    Query params:
      ?category=sahara|beaches|mountains|history
      ?type=attraction|hotel|restaurant
      ?wilaya=<id>
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Place.objects.filter(is_active=True).select_related("wilaya", "category")

        category = request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)

        place_type = request.query_params.get("type")
        if place_type:
            qs = qs.filter(place_type=place_type)

        wilaya_id = request.query_params.get("wilaya")
        if wilaya_id:
            qs = qs.filter(wilaya_id=wilaya_id)

        serializer = PlaceListSerializer(qs, many=True, context={"request": request})
        return Response({"success": True, "count": qs.count(), "data": serializer.data})


class PlaceDetailView(APIView):
    """GET /api/places/<id>/"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, pk):
        place = get_object_or_404(Place, pk=pk, is_active=True)
        serializer = PlaceDetailSerializer(place, context={"request": request})
        return Response({"success": True, "data": serializer.data})
