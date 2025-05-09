import pytest
from form.models import Formulario, FormularioRespondido
from users.models import CustomUser
from maturity_assessment.models import MaturityAssessment

@pytest.mark.django_db
class TestMaturityAssessmentModel:
    def test_create_assessment(self):
        user = CustomUser.objects.create_user(email="test@example.com", password="testpass123")
        form = Formulario.objects.create(nome="Test Form")
        form_respondido = FormularioRespondido.objects.create(
            formulario=form,
            cliente=user
        )
        assessment = MaturityAssessment.objects.create(
            formulario_respondido=form_respondido
        )
        assert str(assessment) == f"Avaliação de Maturidade para {form_respondido}"