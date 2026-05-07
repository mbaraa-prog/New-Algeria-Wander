from datetime import timedelta

from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)

User = get_user_model()


def get_tokens_for_user(user, remember_me=False):
    """
    Generate JWT access + refresh tokens for a user.
    If remember_me is True, extend the refresh token lifetime to 30 days.
    """
    refresh = RefreshToken.for_user(user)

    if remember_me:
        refresh.set_exp(lifetime=timedelta(days=30))

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(APIView):
    """
    POST /api/register/
    Register a new user account.
    Returns JWT tokens on success.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Registration failed. Please fix the errors below.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()
        tokens = get_tokens_for_user(user)
        profile = UserProfileSerializer(user).data

        return Response(
            {
                "success": True,
                "message": f"Welcome to Algeria Wander, {user.username}! 🎉",
                "data": {
                    "user": profile,
                    "tokens": tokens,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/login/
    Authenticate with email + password.
    Returns JWT access and refresh tokens.

    Body:
        email       (str)  - required
        password    (str)  - required
        remember_me (bool) - optional, extends refresh token to 30 days
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Invalid request data.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        remember_me = serializer.validated_data.get("remember_me", False)

        # Authenticate — Django checks the hashed password internally
        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response(
                {
                    "success": False,
                    "message": "Invalid email or password. Please try again.",
                    "errors": {"non_field_errors": ["Invalid credentials."]},
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {
                    "success": False,
                    "message": "Your account has been deactivated. Please contact support.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        tokens = get_tokens_for_user(user, remember_me=remember_me)
        profile = UserProfileSerializer(user).data

        return Response(
            {
                "success": True,
                "message": f"Welcome back, {user.username}! 🌍",
                "data": {
                    "user": profile,
                    "tokens": tokens,
                    "remember_me": remember_me,
                },
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    """
    GET  /api/profile/  — Return the authenticated user's profile.
    PUT  /api/profile/  — Update the authenticated user's profile.

    Requires: Authorization: Bearer <access_token>
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(
            {
                "success": True,
                "data": {"user": serializer.data},
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Profile update failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response(
            {
                "success": True,
                "message": "Profile updated successfully.",
                "data": {"user": serializer.data},
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """
    POST /api/logout/
    Blacklist the refresh token to invalidate the session.

    Body:
        refresh (str) - the refresh token to blacklist
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {
                    "success": False,
                    "message": "Refresh token is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            return Response(
                {
                    "success": False,
                    "message": "Invalid or already expired token.",
                    "errors": {"refresh": [str(e)]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Logged out successfully. Safe travels! 🌟",
            },
            status=status.HTTP_200_OK,
        )
