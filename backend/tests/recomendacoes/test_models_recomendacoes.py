import pytest
from django.core.exceptions import ValidationError
from form.models import Formulario, FormularioRespondido
from users.models import CustomUser
from recomendacoes.models import Recomendacao

@pytest.mark.django_db
class TestRecomendacaoModel:
    def test_create_recomendacao(self):
        cliente = CustomUser.objects.create_user(
            email="cliente@example.com", 
            password="testpass123",
            username="cliente1"
        )
        analista = CustomUser.objects.create_user(
            email="analista@example.com", 
            password="testpass123", 
            is_staff=True,
            username="analista1"
        )
        form = Formulario.objects.create(nome="Test Form")
        form_respondido = FormularioRespondido.objects.create(
            formulario=form,
            cliente=cliente
        )
        rec = Recomendacao.objects.create(
            cliente=cliente,
            formulario_respondido=form_respondido,
            analista=analista,
            nome="Test Recommendation",
            categoria="Governar (GV)",
            tecnologia="Test Tech",
            nist="NIST-123",
            prioridade="alta",
            responsavel="Test Responsible",
            data_inicio="2023-01-01",
            data_fim="2023-06-01",
            meses=6,
            detalhes="Test details",
            investimentos="Test investments",
            urgencia="3",
            gravidade="4"
        )
        assert str(rec) == f"Test Recommendation (Cliente: {cliente})"

    def test_invalid_dates(self):
        cliente = CustomUser.objects.create_user(
            email="cliente2@example.com", 
            password="testpass123",
            username="cliente2"
        )
        form = Formulario.objects.create(nome="Test Form")
        form_respondido = FormularioRespondido.objects.create(
            formulario=form,
            cliente=cliente
        )
        with pytest.raises(ValidationError):
            rec = Recomendacao(
                cliente=cliente,
                formulario_respondido=form_respondido,
                nome="Test",
                categoria="GV",
                data_inicio="2023-06-01",
                data_fim="2023-01-01",
                meses=6,
                urgencia="3",
                gravidade="4"
            )
            rec.full_clean()