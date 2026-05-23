from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Blog, BlogComment
from .serializers import BlogSerializer, BlogCreateUpdateSerializer, BlogCommentSerializer, BlogCommentCreateSerializer


class BlogPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class BlogListView(generics.ListCreateAPIView):
    """List all blogs or create a new blog."""
    
    queryset = Blog.objects.all().prefetch_related('comments')
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
    
    queryset = Blog.objects.all().prefetch_related('comments')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BlogCreateUpdateSerializer
        return BlogSerializer

    def perform_update(self, serializer):
        serializer.save()


class BlogCommentCreateView(APIView):
    """Create a comment on a blog."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, blog_id):
        blog = get_object_or_404(Blog, id=blog_id)
        serializer = BlogCommentCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            comment = serializer.save(blog=blog, author=request.user)
            return Response(
                BlogCommentSerializer(comment, context={'request': request}).data,
                status=201
            )
        return Response(serializer.errors, status=400)


class BlogCommentDeleteView(APIView):
    """Delete a comment on a blog (only by author or admin)."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, comment_id):
        comment = get_object_or_404(BlogComment, id=comment_id)
        
        # Check if user is the comment author or is staff
        if comment.author != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'You do not have permission to delete this comment.'},
                status=403
            )
        
        comment.delete()
        return Response({'detail': 'Comment deleted successfully.'}, status=204)
