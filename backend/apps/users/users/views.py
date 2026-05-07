from datetime import timedelta
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, RegisterSerializer, UserProfileSerializer

User = get_user_model()


def get_tokens(user, remember_me=False):
    refresh = RefreshToken.for_user(user)
    if remember_me:
        refresh.set_exp(lifetime=timedelta(days=30))
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if not s.is_valid():
            return Response({"success": False, "message": "Registration failed.", "errors": s.errors},
                            status=status.HTTP_400_BAD_REQUEST)
        user = s.save()
        return Response({
            "success": True,
            "message": f"Welcome to Algeria Wander, {user.username}! 🎉",
            "data": {"user": UserProfileSerializer(user).data, "tokens": get_tokens(user)},
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = LoginSerializer(data=request.data)
        if not s.is_valid():
            return Response({"success": False, "errors": s.errors}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=s.validated_data["email"],
                            password=s.validated_data["password"])
        if user is None:
            return Response({"success": False, "message": "Invalid email or password."},
                            status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_active:
            return Response({"success": False, "message": "Account is deactivated."},
                            status=status.HTTP_403_FORBIDDEN)
        remember_me = s.validated_data.get("remember_me", False)
        return Response({
            "success": True,
            "message": f"Welcome back, {user.username}! 🌍",
            "data": {"user": UserProfileSerializer(user).data,
                     "tokens": get_tokens(user, remember_me), "remember_me": remember_me},
        })


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"success": True, "data": {"user": UserProfileSerializer(request.user).data}})

    def put(self, request):
        s = UserProfileSerializer(request.user, data=request.data, partial=True)
        if not s.is_valid():
            return Response({"success": False, "errors": s.errors}, status=status.HTTP_400_BAD_REQUEST)
        s.save()
        return Response({"success": True, "message": "Profile updated.", "data": {"user": s.data}})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get("refresh")
        if not token:
            return Response({"success": False, "message": "Refresh token required."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(token).blacklist()
        except TokenError as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"success": True, "message": "Logged out. Safe travels! 🌟"})
