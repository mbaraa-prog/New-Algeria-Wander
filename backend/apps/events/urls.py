from django.urls import path
from .views import EventListView, EventUpcomingView, EventByDateView, EventDetailView

app_name = "events"

urlpatterns = [
    path("",           EventListView.as_view(),    name="event_list"),
    path("upcoming/",  EventUpcomingView.as_view(), name="event_upcoming"),
    path("by-date/",   EventByDateView.as_view(),  name="event_by_date"),
    path("<int:pk>/",  EventDetailView.as_view(),  name="event_detail"),
]
