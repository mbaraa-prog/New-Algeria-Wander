from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from .models import Blog
from .serializers import BlogSerializer, BlogCreateUpdateSerializer


class BlogPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class BlogListView(generics.ListCreateAPIView):
    """List all blogs or create a new blog."""
    
    queryset = Blog.objects.all()
    pagination_class = BlogPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BlogCreateUpdateSerializer
        return BlogSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a blog."""
    
    queryset = Blog.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BlogCreateUpdateSerializer
        return BlogSerializer

    def perform_update(self, serializer):
        serializer.save()
