from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer


class ReviewListCreateView(APIView):
    """
    GET  /api/reviews/         — list all reviews (public)
    POST /api/reviews/         — create a review (auth required)
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        qs = Review.objects.filter(is_active=True).select_related("user", "wilaya", "place")
        wilaya_id = request.query_params.get("wilaya")
        place_id  = request.query_params.get("place")
        if wilaya_id:
            qs = qs.filter(wilaya_id=wilaya_id)
        if place_id:
            qs = qs.filter(place_id=place_id)
        return Response({"success": True, "count": qs.count(),
                         "data": ReviewSerializer(qs, many=True, context={"request": request}).data})

    def post(self, request):
        s = ReviewCreateSerializer(data=request.data, context={"request": request})
        if not s.is_valid():
            return Response({"success": False, "errors": s.errors},
                            status=status.HTTP_400_BAD_REQUEST)
        review = s.save()
        return Response({"success": True, "message": "Review posted successfully!",
                         "data": ReviewSerializer(review, context={"request": request}).data},
                        status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    """
    GET    /api/reviews/<id>/  — detail
    DELETE /api/reviews/<id>/  — owner can delete their own review
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        review = get_object_or_404(Review, pk=pk, is_active=True)
        return Response({"success": True,
                         "data": ReviewSerializer(review, context={"request": request}).data})

    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        if review.user != request.user:
            return Response({"success": False, "message": "You can only delete your own reviews."},
                            status=status.HTTP_403_FORBIDDEN)
        review.delete()
        return Response({"success": True, "message": "Review deleted."})
