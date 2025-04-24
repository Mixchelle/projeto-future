from rest_framework import generics, permissions
from .models import Recomendacao
from .serializers import RecomendacaoSerializer
from django.shortcuts import get_object_or_404

class RecomendacaoListCreateView(generics.ListCreateAPIView):
    serializer_class = RecomendacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cliente_id = self.kwargs["cliente_id"]
        formulario_id = self.kwargs["formulario_id"]
        
        return Recomendacao.objects.filter(
            cliente_id=cliente_id,
            formulario_respondido_id=formulario_id
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'cliente_id': self.kwargs["cliente_id"],
            'formulario_id': self.kwargs["formulario_id"],
            'request': self.request
        })
        return context

class RecomendacaoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecomendacaoSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Recomendacao.objects.all()

    def perform_update(self, serializer):
        # Garante que o analista não seja alterado
        if 'analista' in serializer.validated_data:
            serializer.validated_data.pop('analista')
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()