from rest_framework import serializers
from .models import Recomendacao
from users.models import CustomUser
from form.models import FormularioRespondido
from rest_framework.exceptions import ValidationError

class RecomendacaoSerializer(serializers.ModelSerializer):
    cliente = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role__in=['cliente', 'subcliente']),  # Corrigido para incluir subcliente
        required=True
    )
    
    formulario_respondido = serializers.PrimaryKeyRelatedField(
        queryset=FormularioRespondido.objects.all(),
        required=True
    )
    
    analista = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role__in=['funcionario', 'gestor']),  # Corrigido para roles consistentes
        required=False,
        allow_null=True
    )
    
    # Campos de exibição para choices
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    prioridade_display = serializers.CharField(source='get_prioridade_display', read_only=True)
    impacto_display = serializers.CharField(source='get_impacto_display', read_only=True)
    gravidade_display = serializers.CharField(source='get_gravidade_display', read_only=True)

    class Meta:
        model = Recomendacao
        fields = '__all__'
        read_only_fields = [
            'id', 
            'criado_em', 
            'atualizado_em',
            'categoria_display',
            'prioridade_display',
            'impacto_display',
            'gravidade_display'
        ]

    def validate_analista(self, value):
        request = self.context.get('request')
        
        if value and value.role not in ['funcionario', 'gestor']:  # Corrigido para roles consistentes
            raise serializers.ValidationError("O analista deve ter a role 'funcionario' ou 'gestor'")
        
        # Se não foi fornecido um analista, usa o usuário atual
        if not value and request and request.user.is_authenticated:
            if request.user.role in ['funcionario', 'gestor']:
                return request.user
            raise serializers.ValidationError("Apenas funcionários ou gestores podem ser analistas")
        
        return value

    def create(self, validated_data):
        # Garante que o analista seja definido corretamente
        if 'analista' not in validated_data:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                validated_data['analista'] = request.user
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Remove o analista dos dados validados para evitar alteração não autorizada
        validated_data.pop('analista', None)
        return super().update(instance, validated_data)