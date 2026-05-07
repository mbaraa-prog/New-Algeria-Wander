from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event
from .serializers import EventSerializer


class EventListView(APIView):
    """GET /api/events/"""

    def get(self, request):
        qs = Event.objects.filter(is_active=True).select_related("wilaya")
        serializer = EventSerializer(qs, many=True, context={"request": request})
        return Response({"success": True, "count": qs.count(), "data": serializer.data})


class EventUpcomingView(APIView):
    """
    GET /api/events/upcoming/
    Returns events whose end_date >= today, limited to 6 for the homepage carousel.
    """

    def get(self, request):
        today = timezone.now().date()
        qs = Event.objects.filter(is_active=True, end_date__gte=today).select_related("wilaya")[:6]
        serializer = EventSerializer(qs, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class EventByDateView(APIView):
    """
    GET /api/events/by-date/?date=YYYY-MM-DD
    Returns all events happening on the given date.
    Used by the search bar WHEN filter.
    """

    def get(self, request):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"success": False, "message": "date query param required (YYYY-MM-DD)."},
                            status=400)
        try:
            from datetime import date
            search_date = date.fromisoformat(date_str)
        except ValueError:
            return Response({"success": False, "message": "Invalid date format. Use YYYY-MM-DD."},
                            status=400)

        qs = Event.objects.filter(
            is_active=True,
            start_date__lte=search_date,
            end_date__gte=search_date,
        ).select_related("wilaya")

        serializer = EventSerializer(qs, many=True, context={"request": request})
        return Response({"success": True, "date": date_str, "count": qs.count(), "data": serializer.data})


class EventDetailView(APIView):
    """GET /api/events/<id>/"""

    def get(self, request, pk):
        event = get_object_or_404(Event, pk=pk, is_active=True)
        serializer = EventSerializer(event, context={"request": request})
        return Response({"success": True, "data": serializer.data})
