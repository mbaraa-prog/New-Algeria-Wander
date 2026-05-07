from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Profile, Wilaya, Category,
    Place, PlaceImage, Review, Favorite,
    Blog, Notification
)


# ══════════════════════════════════════════════
#  USER
# ══════════════════════════════════════════════
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Affiche le champ 'role' en plus des champs Django par défaut.
    """
    list_display  = ('username', 'email', 'role', 'date_inscription', 'is_active')
    list_filter   = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')
    ordering      = ('-date_joined',)

    # Ajoute le champ 'role' dans le formulaire d'édition
    fieldsets = UserAdmin.fieldsets + (
        ('Rôle Algeria Wander', {'fields': ('role',)}),
    )


# ══════════════════════════════════════════════
#  PROFILE
# ══════════════════════════════════════════════
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display  = ('user', 'telephone', 'pays', 'date_naissance')
    search_fields = ('user__username', 'telephone')


# ══════════════════════════════════════════════
#  WILAYA
# ══════════════════════════════════════════════
@admin.register(Wilaya)
class WilayaAdmin(admin.ModelAdmin):
    list_display  = ('nom', 'region')
    search_fields = ('nom', 'region')
    list_filter   = ('region',)


# ══════════════════════════════════════════════
#  CATEGORY
# ══════════════════════════════════════════════
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ('nom',)
    search_fields = ('nom',)


# ══════════════════════════════════════════════
#  PLACE IMAGE  (inline — s'affiche dans la page Place)
# ══════════════════════════════════════════════
class PlaceImageInline(admin.TabularInline):
    """
    Permet d'ajouter plusieurs photos directement
    depuis la page d'un lieu, sans changer de page.
    """
    model = PlaceImage
    extra = 2  # 2 champs vides affichés par défaut


# ══════════════════════════════════════════════
#  PLACE
# ══════════════════════════════════════════════
@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display  = ('nom', 'wilaya', 'category', 'telephone')
    search_fields = ('nom', 'adresse')
    list_filter   = ('wilaya', 'category')
    inlines       = [PlaceImageInline]  # galerie d'images intégrée


# ══════════════════════════════════════════════
#  REVIEW
# ══════════════════════════════════════════════
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ('user', 'place', 'note', 'date')
    search_fields = ('user__username', 'place__nom')
    list_filter   = ('note', 'date')


# ══════════════════════════════════════════════
#  FAVORITE
# ══════════════════════════════════════════════
@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display  = ('user', 'place', 'date_ajout')
    search_fields = ('user__username', 'place__nom')


# ══════════════════════════════════════════════
#  BLOG
# ══════════════════════════════════════════════
@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display  = ('titre', 'user', 'place', 'created_at')
    search_fields = ('titre', 'user__username')
    list_filter   = ('created_at',)


# ══════════════════════════════════════════════
#  NOTIFICATION
# ══════════════════════════════════════════════
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ('user', 'type', 'lu', 'created_at')
    search_fields = ('user__username', 'message')
    list_filter   = ('type', 'lu')
    actions       = ['marquer_comme_lu']

    def marquer_comme_lu(self, request, queryset):
        queryset.update(lu=True)
    marquer_comme_lu.short_description = "Marquer comme lu"