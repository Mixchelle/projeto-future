from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExecutiveReportView,
    SaveAssessmentView,
    ControlAssessmentViewSet,
    RiskAssessmentViewSet,
    QuestionViewSet,
    AssessmentResponseViewSet,
    ReportViewSet,
    SubmitReportView
)

# Criando um router para registrar os ViewSets
router = DefaultRouter()
router.register(r'control-assessments', ControlAssessmentViewSet, basename='control-assessment')
router.register(r'risk-assessments', RiskAssessmentViewSet, basename='risk-assessment')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'responses', AssessmentResponseViewSet, basename='assessmentresponse')
router.register(r'reports', ReportViewSet, basename='report')

# Definindo as URLs da aplicação
urlpatterns = [
    path('', include(router.urls)),  # Inclui todas as rotas do router
    path('save-assessment/', SaveAssessmentView.as_view(), name='save-assessment'),
    path('executive-report/', ExecutiveReportView.as_view(), name='executive-report'),
    path('submit/', SubmitReportView.as_view(), name='submit-report'),  # Rota para o SubmitReportView
    path('reports/lgpd_score/', ReportViewSet.as_view({'get': 'list'}), name='lgpd-score'),  # Adicionando a rota para lgpd_score
]
