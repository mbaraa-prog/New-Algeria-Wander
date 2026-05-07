from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


# ══════════════════════════════════════════════
#  USER  (remplace le User Django par défaut)
# ══════════════════════════════════════════════
class User(AbstractUser):
    """
    Utilisateur personnalisé.
    Ajoute le rôle (admin / user) et la date d'inscription.
    IMPORTANT : dans settings.py → AUTH_USER_MODEL = 'core.User'
    """
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('user',  'Utilisateur'),
    ]
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='user'
    )
    date_inscription = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# ══════════════════════════════════════════════
#  PROFILE
# ══════════════════════════════════════════════
class Profile(models.Model):
    """
    Profil étendu — lié à chaque User (1 pour 1).
    Contient photo, bio, téléphone, date de naissance et pays
    (tous visibles dans les maquettes du rapport).
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    photo = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )
    bio            = models.TextField(blank=True)
    telephone      = models.CharField(max_length=20, blank=True)
    date_naissance = models.DateField(blank=True, null=True)
    pays           = models.CharField(max_length=100, blank=True, default='Algérie')

    def __str__(self):
        return f"Profil de {self.user.username}"


# ══════════════════════════════════════════════
#  WILAYA
# ══════════════════════════════════════════════
class Wilaya(models.Model):
    """
    Les 58 wilayas d'Algérie.
    Contient nom et région (Nord, Sud, Est, Ouest...).
    """
    nom    = models.CharField(max_length=100)
    region = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nom} ({self.region})"

    class Meta:
        verbose_name_plural = "Wilayas"
        ordering = ['nom']


# ══════════════════════════════════════════════
#  CATEGORY
# ══════════════════════════════════════════════
class Category(models.Model):
    """
    Type de lieu : Hôtel, Restaurant, Monument, Site naturel, Événement...
    """
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['nom']


# ══════════════════════════════════════════════
#  PLACE  (Lieu touristique)
# ══════════════════════════════════════════════
class Place(models.Model):
    """
    Un lieu touristique en Algérie.
    Inclut les infos de base + les infos pratiques visibles
    dans la page 'Add Location' du rapport (horaires, tel, site web).
    """
    nom         = models.CharField(max_length=200)
    description = models.TextField()
    adresse     = models.CharField(max_length=300)
    image       = models.ImageField(
        upload_to='places/',
        blank=True,
        null=True
    )
    wilaya   = models.ForeignKey(
        Wilaya,
        on_delete=models.CASCADE,
        related_name='places'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='places'
    )
    # Infos pratiques (page Add Location du rapport)
    horaires_ouverture = models.CharField(
        max_length=100,
        blank=True,
        help_text="Ex: Lun-Ven 08:00 - 17:00"
    )
    telephone = models.CharField(max_length=20, blank=True)
    site_web  = models.URLField(blank=True)

    def __str__(self):
        return f"{self.nom} — {self.wilaya.nom}"

    class Meta:
        ordering = ['nom']


# ══════════════════════════════════════════════
#  PLACE IMAGE  (galerie — plusieurs photos par lieu)
# ══════════════════════════════════════════════
class PlaceImage(models.Model):
    """
    Galerie d'images pour un lieu.
    La page 'Details' du rapport montre plusieurs photos par lieu.
    """
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='places/gallery/')

    def __str__(self):
        return f"Photo de {self.place.nom}"


# ══════════════════════════════════════════════
#  REVIEW  (Avis)
# ══════════════════════════════════════════════
class Review(models.Model):
    """
    Avis laissé par un utilisateur sur un lieu.
    - 1 seul avis par utilisateur par lieu (unique_together)
    - Note entre 1 et 5
    - Date automatique
    """
    user  = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    texte = models.TextField()
    note  = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    date  = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'place')
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} → {self.place.nom} ({self.note}/5)"


# ══════════════════════════════════════════════
#  FAVORITE  (Favoris)
# ══════════════════════════════════════════════
class Favorite(models.Model):
    """
    Un utilisateur sauvegarde un lieu en favori.
    Impossible d'ajouter le même lieu deux fois (unique_together).
    """
    user  = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    date_ajout = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'place')
        ordering = ['-date_ajout']

    def __str__(self):
        return f"{self.user.username} aime {self.place.nom}"


# ══════════════════════════════════════════════
#  BLOG
# ══════════════════════════════════════════════
class Blog(models.Model):
    """
    Article de blog écrit par un utilisateur.
    Visible dans la page 'Blogs & Add Blog' du rapport.
    Peut être lié à un lieu (optionnel).
    """
    user    = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='blogs'
    )
    place   = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='blogs'
    )
    titre   = models.CharField(max_length=200)
    contenu = models.TextField()
    image   = models.ImageField(
        upload_to='blogs/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.titre} par {self.user.username}"


# ══════════════════════════════════════════════
#  NOTIFICATION
# ══════════════════════════════════════════════
class Notification(models.Model):
    """
    Notifications utilisateur.
    Visible dans la page 'Notifications' du rapport :
    commentaires, mentions, mises à jour du compte.
    """
    TYPE_CHOICES = [
        ('comment', 'Commentaire'),
        ('like',    'Like'),
        ('account', 'Compte'),
        ('offer',   'Offre'),
    ]

    user       = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type       = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message    = models.TextField()
    lu         = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        statut = "lu" if self.lu else "non lu"
        return f"Notif {self.type} → {self.user.username} ({statut})"