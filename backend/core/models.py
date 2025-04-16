from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Administrator'),
        ('evaluator', 'Evaluator'),
        ('client', 'Client'),
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='client')
    
    # Adicionando o related_name para resolver o conflito de relacionamento reverso
    groups = models.ManyToManyField(
        Group,
        related_name='core_user_set',  # Nome do relacionamento reverso para evitar conflito
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='core_user_permissions',  # Nome do relacionamento reverso para evitar conflito
        blank=True
    )
    
    def __str__(self):
        return self.username


class Assessment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    user = models.ForeignKey(User, related_name='assessments', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


class Report(models.Model):
    assessment = models.ForeignKey(Assessment, related_name='reports', on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Report for {self.assessment.title}'


class Compliance(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    standard_link = models.URLField()

    def __str__(self):
        return self.name
    
class ControlAssessment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class Standard(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name
