from django.contrib import admin
from django.urls import path, re_path, include
from django.http import HttpResponse

from rest_framework.routers import DefaultRouter
from rest_framework import permissions

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ControlAssessmentViewSet,
    CustomTokenObtainPairView,
    UserInfoView,
    ComplianceView,
    ValidateTokenView,
    create_report,
    public_view,
    protected_view,
)

# Swagger
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Projeto FS3M",
        default_version="v1",
        description="Documentação da API para a CyberSec Maturity Platform",
        terms_of_service="https://www.seusite.com/terms/",
        contact=openapi.Contact(email="suporte@seusite.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# DRF router
router = DefaultRouter()
router.register(r"control-assessments", ControlAssessmentViewSet)

# Home e form views simples
def home(request):
    return HttpResponse("Bem-vindo à CyberSec Maturity Platform!")

def form_view(request):
    return HttpResponse("Página do formulário")

urlpatterns = [
    # Home
    path("", home, name="home"),

    # Admin
    path("admin/", admin.site.urls),

    # Swagger
    re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),

    # API via DRF router
    path("api/", include(router.urls)),

    # Autenticação JWT
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/validate-token/", ValidateTokenView.as_view(), name="validate-token"),
    path("auth/user/", UserInfoView.as_view(), name="user_info"),

    # Endpoints principais
    path("compliance/", ComplianceView.as_view(), name="compliance-list"),
    path("create_report/", create_report, name="create_report"),
    path("api/protected/", protected_view, name="protected_view"),
    path("api/public/", public_view, name="public_view"),

    # Apps específicos
    path("assessments/", include("assessments.urls")),
    path("recommendations/", include("recomendacoes.urls")),
    path("maturity-results/", include("maturity_assessment.urls")),
    path("form/", include("form.urls")),
    path("core/", include("core.urls")),
    path("api/", include("api.urls")),  # Esse pode ficar por último, pois é genérico
]
