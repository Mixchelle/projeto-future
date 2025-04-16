from django.urls import path
from .views import MaturityAssessmentView

urlpatterns = [
    path(
        "maturity-results/<int:formulario_respondido_id>/",
        MaturityAssessmentView.as_view(),
        name="maturity-assessment",
    ),
]
