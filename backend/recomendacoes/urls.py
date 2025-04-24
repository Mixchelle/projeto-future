from django.urls import path
from .views import RecomendacaoListCreateView, RecomendacaoRetrieveUpdateDestroyView

urlpatterns = [
    path(
        "recomendacoes/<int:cliente_id>/<int:formulario_id>/",
        RecomendacaoListCreateView.as_view(),
        name="recomendacoes-list-create",
    ),
    path(
        "recomendacoes/<int:pk>/",
        RecomendacaoRetrieveUpdateDestroyView.as_view(),
        name="recomendacao-detail",
    ),
]