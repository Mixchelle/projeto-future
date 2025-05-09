from rest_framework import serializers
from .models import Recomendacao
from django.shortcuts import get_object_or_404
from users.models import CustomUser
from form.models import FormularioRespondido

class RecomendacaoSerializer(serializers.ModelSerializer):
    # Campos de entrada
    cliente = serializers.PrimaryKeyRelatedField(read_only=True)
    formulario_respondido = serializers.PrimaryKeyRelatedField(read_only=True)
    analista = serializers.PrimaryKeyRelatedField(read_only=True)
    
    # Campos de exibição
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    prioridade_display = serializers.CharField(source='get_prioridade_display', read_only=True)
    urgencia_display = serializers.CharField(source='get_urgencia_display', read_only=True)
    gravidade_display = serializers.CharField(source='get_gravidade_display', read_only=True)

    class Meta:
        model = Recomendacao
        fields = '__all__'
        read_only_fields = ['id', 'criado_em', 'atualizado_em', 'analista']

    def create(self, validated_data):
        request = self.context.get('request')
        cliente_id = self.context.get('cliente_id')
        formulario_id = self.context.get('formulario_id')

        # Obtém os objetos relacionados
        cliente = get_object_or_404(CustomUser, id=cliente_id)
        formulario = get_object_or_404(FormularioRespondido, id=formulario_id, cliente_id=cliente_id)
        
        # Cria a recomendação com o analista sendo o usuário autenticado
        recomendacao = Recomendacao.objects.create(
            cliente=cliente,
            formulario_respondido=formulario,
            analista=request.user,
            **validated_data
        )
        
        return recomendacao