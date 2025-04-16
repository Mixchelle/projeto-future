from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ControlAssessmentViewSet
import api.views as views

router = DefaultRouter()
router.register(r'control-assessments', ControlAssessmentViewSet, basename='control-assessment')

urlpatterns = [
    # Inclui as rotas do router
    path('control-assessments/', include(router.urls)),

    # Define a rota manualmente para listagem e criação de control-assessments
    path(
        'control-assessments/manual/', 
        views.ControlAssessmentViewSet.as_view({'get': 'list', 'post': 'create'}), 
        name='control-assessment-list'
    ),
]
