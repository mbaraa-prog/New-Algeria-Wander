from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category
from .serializers import CategorySerializer


class CategoryListView(APIView):
    """GET /api/categories/"""

    def get(self, request):
        categories = Category.objects.filter(is_active=True)
        return Response({
            "success": True,
            "data": CategorySerializer(categories, many=True, context={"request": request}).data,
        })
