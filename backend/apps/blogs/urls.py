from django.urls import path
from .views import BlogListView, BlogDetailView, BlogCommentCreateView, BlogCommentDeleteView

app_name = 'blogs'

urlpatterns = [
    path('', BlogListView.as_view(), name='blog-list'),
    path('<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),
    path('<int:blog_id>/comments/', BlogCommentCreateView.as_view(), name='blog-comment-create'),
    path('comments/<int:comment_id>/', BlogCommentDeleteView.as_view(), name='blog-comment-delete'),
]
