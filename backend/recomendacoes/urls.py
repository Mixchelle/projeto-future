from django.urls import path
from .views import RecomendacaoListCreateView, RecomendacaoDetailView

urlpatterns = [
    path(
        "recomendacoes/<int:cliente_id>/<int:formulario_id>/",
        RecomendacaoListCreateView.as_view(),
        name="recomendacoes-list-create",
    ),
    path(
        "recomendacao/<int:pk>/",
        RecomendacaoDetailView.as_view(),
        name="recomendacao-detail",
    ),
]
