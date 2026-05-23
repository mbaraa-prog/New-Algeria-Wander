from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

urlpatterns = [
    path("", RedirectView.as_view(url="/api/home/", permanent=False), name="root"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.users.urls", namespace="users")),
    path("api/home/", include("apps.home.urls", namespace="home")),
    path("api/categories/", include("apps.categories.urls", namespace="categories")),
    path("api/wilayas/", include("apps.wilayas.urls", namespace="wilayas")),
    path("api/places/", include("apps.places.urls", namespace="places")),
    path("api/events/", include("apps.events.urls", namespace="events")),
    path("api/reviews/", include("apps.reviews.urls", namespace="reviews")),
    path("api/favorites/", include("apps.favorites.urls", namespace="favorites")),
    path("api/blogs/", include("apps.blogs.urls", namespace="blogs")),
    path("api/notifications/", include("apps.notifications.urls", namespace="notifications")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
