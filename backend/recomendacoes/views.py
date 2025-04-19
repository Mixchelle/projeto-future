from rest_framework import generics, permissions
from .models import Recomendacao
from .serializers import RecomendacaoSerializer
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from users.models import CustomUser
from form.models import FormularioRespondido

class RecomendacaoListCreateView(generics.ListCreateAPIView):
    serializer_class = RecomendacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cliente_id = self.kwargs['cliente_id']
        formulario_id = self.kwargs['formulario_id']
        
        # Verifica se o cliente ou subcliente existe
        cliente = get_object_or_404(CustomUser, id=cliente_id, role__in=['cliente', 'subcliente'])
        
        # Verifica se o formulário existe e pertence ao cliente/subcliente
        formulario = get_object_or_404(
            FormularioRespondido,
            id=formulario_id,
            cliente_id=cliente_id
        )
        
        # Permissões de visualização
        if self.request.user.role in ['funcionario', 'gestor']:
            return Recomendacao.objects.filter(
                cliente_id=cliente_id,
                formulario_respondido_id=formulario_id
            )
        elif self.request.user.role in ['cliente', 'subcliente'] and self.request.user.id == cliente_id:
            return Recomendacao.objects.filter(
                cliente_id=cliente_id,
                formulario_respondido_id=formulario_id
            )
        else:
            raise PermissionDenied("Você não tem permissão para acessar estas recomendações.")

    def perform_create(self, serializer):
        cliente_id = self.kwargs['cliente_id']
        formulario_id = self.kwargs['formulario_id']
        
        # Permissões de criação
        if self.request.user.role not in ['funcionario', 'gestor']:
            raise PermissionDenied("Apenas funcionários ou gestores podem criar recomendações.")
        
        # Verifica se o cliente/subcliente existe
        cliente = get_object_or_404(CustomUser, id=cliente_id, role__in=['cliente', 'subcliente'])
        
        # Verifica se o formulário pertence ao cliente/subcliente
        formulario = get_object_or_404(
            FormularioRespondido,
            id=formulario_id,
            cliente_id=cliente_id
        )
        
        # Garante que o criador seja o usuário logado
        serializer.save(
            cliente=cliente,
            formulario_respondido=formulario,
            analista=self.request.user
        )

class RecomendacaoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecomendacaoSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        # Filtra baseado no papel do usuário
        if self.request.user.role == 'gestor':
            # Gestores podem ver todas as recomendações
            return Recomendacao.objects.all()
        elif self.request.user.role == 'funcionario':
            # Funcionários só veem as que criaram
            return Recomendacao.objects.filter(analista=self.request.user)
        elif self.request.user.role in ['cliente', 'subcliente']:
            # Clientes/Subclientes só veem as suas
            return Recomendacao.objects.filter(cliente=self.request.user)
        else:
            return Recomendacao.objects.none()

    def perform_update(self, serializer):
        # Permissões de edição
        if self.request.user.role == 'gestor':
            # Gestores podem editar qualquer recomendação
            pass
        elif self.request.user.role == 'funcionario':
            # Funcionários só editam as que criaram
            if serializer.instance.analista != self.request.user:
                raise PermissionDenied("Você só pode editar recomendações que criou.")
        else:
            raise PermissionDenied("Você não tem permissão para editar recomendações.")
        
        # Remove o campo analista se foi enviado
        if 'analista' in serializer.validated_data:
            serializer.validated_data.pop('analista')
        
        serializer.save()

    def perform_destroy(self, instance):
        # Permissões de exclusão
        if self.request.user.role == 'gestor':
            # Gestores podem excluir qualquer recomendação
            pass
        elif self.request.user.role == 'funcionario':
            # Funcionários só excluem as que criaram
            if instance.analista != self.request.user:
                raise PermissionDenied("Você só pode excluir recomendações que criou.")
        else:
            raise PermissionDenied("Você não tem permissão para excluir recomendações.")
        
        instance.delete()