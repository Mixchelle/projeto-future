from rest_framework import serializers
from .models import Recomendacao

class RecomendacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recomendacao
        fields = '__all__'
