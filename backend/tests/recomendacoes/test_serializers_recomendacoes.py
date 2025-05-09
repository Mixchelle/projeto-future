import pytest
from datetime import date, timedelta
from django.test import RequestFactory
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

from users.models import CustomUser
from form.models import Formulario, FormularioRespondido
from recomendacoes.models import Recomendacao
from recomendacoes.serializers import RecomendacaoSerializer

@pytest.mark.django_db
class TestRecomendacaoSerializer:

    @pytest.fixture
    def setup_data(self):
        """Fixture para criar dados de teste"""
        cliente = CustomUser.objects.create_user(
            username="cliente",
            email="cliente@example.com",
            password="testpass123"
        )
        analista = CustomUser.objects.create_user(
            username="analista",
            email="analista@example.com",
            password="testpass123",
            is_staff=True
        )
        
        formulario = Formulario.objects.create(nome="Test Form")
        form_respondido = FormularioRespondido.objects.create(
            formulario=formulario,
            cliente=cliente,
            status="concluido",
            versao=1
        )
        
        factory = RequestFactory()
        request = factory.post('/fake-url/')
        request.user = analista
        
        return {
            "cliente": cliente,
            "analista": analista,
            "formulario": formulario,
            "form_respondido": form_respondido,
            "request": request
        }

    def test_serializer_valid_data(self, setup_data):
        """Teste com dados válidos deve ser bem-sucedido"""
        valid_data = {
            "nome": "Recomendação Válida",
            "categoria": "Governar (GV)",
            "tecnologia": "Tecnologia X",
            "nist": "NIST-001",
            "prioridade": "alta",
            "responsavel": "Equipe de TI",
            "data_inicio": date.today().isoformat(),
            "data_fim": (date.today() + timedelta(days=30)).isoformat(),
            "meses": 1,
            "detalhes": "Detalhes válidos",
            "investimentos": "Investimento médio",
            "urgencia": "3",
            "gravidade": "4"
        }

        serializer = RecomendacaoSerializer(
            data=valid_data,
            context={
                "request": setup_data["request"],
                "cliente_id": setup_data["cliente"].id,
                "formulario_id": setup_data["form_respondido"].id
            }
        )

        assert serializer.is_valid()
        recomendacao = serializer.save()
        assert recomendacao.id is not None

    def test_serializer_invalid_dates(self, setup_data):
        """Teste deve detectar datas inconsistentes"""
        invalid_data = {
            "nome": "Recomendação Inválida",
            "categoria": "Detectar (DE)",
            "tecnologia": "Tecnologia Z",
            "nist": "NIST-003",
            "prioridade": "baixa",
            "responsavel": "Equipe de Monitoramento",
            "data_inicio": (date.today() + timedelta(days=1)).isoformat(),  # Amanhã
            "data_fim": date.today().isoformat(),  # Hoje (inválido)
            "meses": 1,
            "detalhes": "Detalhes inválidos",
            "investimentos": "Investimento baixo",
            "urgencia": "2",
            "gravidade": "2"
        }

        serializer = RecomendacaoSerializer(
            data=invalid_data,
            context={
                "request": setup_data["request"],
                "cliente_id": setup_data["cliente"].id,
                "formulario_id": setup_data["form_respondido"].id
            }
        )

        if serializer.is_valid():
            try:
                recomendacao = serializer.save()
                recomendacao.full_clean()
                pytest.fail("Deveria ter levantado ValidationError para datas inconsistentes")
            except ValidationError as e:
                error_messages = [msg for msg_list in e.message_dict.values() for msg in msg_list]
                assert any("data de início" in msg.lower() for msg in error_messages)
        else:
            assert 'data_fim' in serializer.errors or '__all__' in serializer.errors

    def test_serializer_missing_required_fields(self, setup_data):
        """Teste deve detectar campos obrigatórios faltando"""
        incomplete_data = {
            "nome": "Recomendação Incompleta",
            "categoria": "Governar (GV)"
            # Faltam outros campos obrigatórios
        }

        serializer = RecomendacaoSerializer(
            data=incomplete_data,
            context={
                "request": setup_data["request"],
                "cliente_id": setup_data["cliente"].id,
                "formulario_id": setup_data["form_respondido"].id
            }
        )

        assert not serializer.is_valid()
        
        # Campos obrigatórios reais, excluindo 'urgencia' e 'gravidade' (que são opcionais)
        actual_required_fields = [
            'nist',
            'prioridade',
            'data_inicio',
            'data_fim',
            'meses',
            'detalhes',
            'investimentos'
        ]
        
        for field in actual_required_fields:
            assert field in serializer.errors, f"Campo obrigatório {field} faltando"
