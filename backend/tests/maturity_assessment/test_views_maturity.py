import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from decimal import Decimal

from form.models import FormularioRespondido, Formulario
from users.models import CustomUser
from maturity_assessment.models import MaturityAssessment, CategoriaMaturity

@pytest.mark.django_db
class TestMaturityAssessmentView:

    @pytest.fixture
    def setup_data(self):
        user = CustomUser.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        formulario = Formulario.objects.create(nome="Test Form")
        form_respondido = FormularioRespondido.objects.create(
            formulario=formulario,
            cliente=user,
            status="concluido",
            versao=1
        )
        maturity_assessment = MaturityAssessment.objects.create(
            formulario_respondido=form_respondido
        )
        CategoriaMaturity.objects.create(
            maturity_assessment=maturity_assessment,
            nome="Governança",
            sigla="GOV",
            tipo="FUNCAO",
            media_politica=Decimal("2.5"),
            media_pratica=Decimal("3.0"),
            media_total=Decimal("2.8")
        )
        return {
            "user": user,
            "form_respondido": form_respondido,
            "maturity_assessment": maturity_assessment
        }

    def test_get_maturity_assessment_success(self, setup_data):
        client = APIClient()
        user = setup_data["user"]
        form_respondido = setup_data["form_respondido"]
        
        client.force_authenticate(user=user)

        with patch('maturity_assessment.views.calculate_maturity') as mock_calculate:
            # Criamos um mock que retorna um objeto MaturityAssessment real
            mock_result = setup_data["maturity_assessment"]
            mock_calculate.return_value = mock_result

            url = reverse("maturity-assessment", kwargs={"formulario_respondido_id": form_respondido.id})
            response = client.get(url)
            
            assert response.status_code == status.HTTP_200_OK
            assert "funcoes" in response.data
            mock_calculate.assert_called_once_with(form_respondido.id)

    def test_get_maturity_assessment_not_found(self, setup_data):
        client = APIClient()
        user = setup_data["user"]
        client.force_authenticate(user=user)
        
        url = reverse("maturity-assessment", kwargs={"formulario_respondido_id": 9999})
        response = client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_maturity_assessment_unauthenticated(self, setup_data):
        client = APIClient()
        form_respondido = setup_data["form_respondido"]
        
        url = reverse("maturity-assessment", kwargs={"formulario_respondido_id": form_respondido.id})
        response = client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED