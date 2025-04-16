from rest_framework import generics
from .models import Recomendacao
from .serializers import RecomendacaoSerializer

class RecomendacaoListCreateView(generics.ListCreateAPIView):
    serializer_class = RecomendacaoSerializer

    def get_queryset(self):
        cliente_id = self.kwargs['cliente_id']
        formulario_id = self.kwargs['formulario_id']
        return Recomendacao.objects.filter(cliente_id=cliente_id, formulario_respondido_id=formulario_id)

class RecomendacaoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recomendacao.objects.all()
    serializer_class = RecomendacaoSerializer
