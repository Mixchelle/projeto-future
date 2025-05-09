from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FormularioPendenciaView,
    FormularioViewSet,
    CategoriaViewSet,
    PerguntaViewSet,
    CategoriasByFormularioView,
    PerguntasByCategoriaView,
    FormularioCompletoView,
    FormulariosEmAndamentoView,
    TodosFormulariosEmAnaliseView,
    TodosFormulariosRespondidosView,
)

router = DefaultRouter()
router.register(r"formularios", FormularioViewSet)
router.register(r"categorias", CategoriaViewSet)
router.register(r"perguntas", PerguntaViewSet)

urlpatterns = [
    path("", include(router.urls)),
    # Rota para listar categorias de um formulário específico
    path(
        "formularios/<int:formulario_id>/categorias/",
        CategoriasByFormularioView.as_view(),
        name="categorias-by-formulario",
    ),
    # Rota para listar perguntas de uma categoria específica
    path(
        "categorias/<int:categoria_id>/perguntas/",
        PerguntasByCategoriaView.as_view(),
        name="perguntas-by-categoria",
    ),
    path(
        "formularios/<int:form_id>/clientes/<int:cliente_id>/",
        FormularioCompletoView.as_view(),
        name="formulario-completo",
    ),
    path(
        "formularios/completo/",
        FormularioCompletoView.as_view(),
        name="novo-formulario",
    ),
    path(
        "clientes/<int:cliente_id>/formularios-em-andamento/",
        FormulariosEmAndamentoView.as_view(),
        name="formularios-em-andamento",
    ),
    path(
        "formularios-em-analise/",
        TodosFormulariosEmAnaliseView.as_view(),
        name="formularios-em-analise-todos",
    ),
    path('formularios-respondidos-todos/', TodosFormulariosRespondidosView.as_view(), name='todos-formularios-respondidos'),

      path(
        'formularios/<int:form_id>/pendencia/',
        FormularioPendenciaView.as_view(),
        name='formulario-pendencia'
    ),
]
