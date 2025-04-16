# backend/compliance/models.py
from django.db import models

class Framework(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

class Control(models.Model):
    framework = models.ForeignKey(Framework, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    