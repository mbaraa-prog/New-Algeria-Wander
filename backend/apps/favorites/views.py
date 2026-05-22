from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Favorite
from .serializers import FavoriteSerializer, FavoriteCreateSerializer

class FavoriteListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """GET /api/favorites/ — List current user's favorites."""
        qs = Favorite.objects.filter(user=request.user).select_related("place")
        serializer = FavoriteSerializer(qs, many=True, context={"request": request})
        return Response({
            "success": True,
            "count": qs.count(),
            "data": serializer.data
        })

    def post(self, request):
        """POST /api/favorites/ — Add a place to favorites."""
        serializer = FavoriteCreateSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return Response({
                "success": False, 
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        favorite = serializer.save()
        return Response({
            "success": True,
            "message": "Added to favorites.",
            "data": FavoriteSerializer(favorite, context={"request": request}).data
        }, status=status.HTTP_201_CREATED)

class FavoriteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        """DELETE /api/favorites/<id>/ — Remove a favorite."""
        favorite = get_object_or_404(Favorite, pk=pk, user=request.user)
        favorite.delete()
        return Response({
            "success": True,
            "message": "Removed from favorites."
        }, status=status.HTTP_200_OK)
