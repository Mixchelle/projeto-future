from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _


# Gerenciador Personalizado para o CustomUser (ajustado para email)
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O campo 'email' é obrigatório")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superusuário precisa ter is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superusuário precisa ter is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


# Modelo Personalizado de Usuário (sem username)
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ("cliente", "Cliente"),
        ("subcliente", "Subcliente"),
        ("funcionario", "Funcionário"),
        ("gestor", "Gestor"),
    ]

    # Campos personalizados
    username = models.CharField(
        max_length=150, unique=True
    )  # Reintroduz username como único
    nome = models.CharField(max_length=255)  # Campo para o nome completo do usuário
    email = models.EmailField(_("email address"), unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default="cliente")

    # Definições para o Django reconhecer o email como identificador
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "nome"]  # Campos obrigatórios ao criar superusuário

    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(
        Permission, related_name="customuser_permissions", blank=True
    )

    cliente = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subclientes",
        limit_choices_to={"role": "cliente"},
    )

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.nome} ({self.email})"

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        permissions = [
            ("view_user", "Pode ver usuários"),
            ("change_user", "Pode alterar usuários"),
            ("delete_user", "Pode excluir usuários"),
            ("view_report", "Pode ver relatórios de segurança"),
            ("create_report", "Pode criar relatórios de segurança"),
            ("delete_report", "Pode excluir relatórios de segurança"),
        ]


# Modelo de Relatórios
class Report(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="reports"
    )

    def __str__(self):
        return self.title
