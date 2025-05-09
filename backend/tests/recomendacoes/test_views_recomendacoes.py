import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta

from users.models import CustomUser
from form.models import Formulario, FormularioRespondido
from recomendacoes.models import Recomendacao

@pytest.mark.django_db
class TestRecomendacaoViews:

    @pytest.fixture
    def setup_data(self):
        # Criar usuários
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
        
        # Criar formulário e formulário respondido
        formulario = Formulario.objects.create(nome="Test Form")
        form_respondido = FormularioRespondido.objects.create(
            formulario=formulario,
            cliente=cliente,
            status="concluido",
            versao=1
        )
        
        # Criar recomendação
        recomendacao = Recomendacao.objects.create(
            cliente=cliente,
            formulario_respondido=form_respondido,
            analista=analista,
            nome="Test Recommendation",
            categoria="Governar (GV)",
            tecnologia="Tecnologia X",
            nist="NIST-001",
            prioridade="alta",
            responsavel="Equipe de TI",
            data_inicio=date.today(),
            data_fim=date.today() + timedelta(days=30),
            meses=1,
            detalhes="Detalhes da recomendação",
            investimentos="Investimento médio",
            urgencia="3",
            gravidade="4"
        )
        
        return {
            "cliente": cliente,
            "analista": analista,
            "formulario": formulario,
            "form_respondido": form_respondido,
            "recomendacao": recomendacao
        }

    def test_list_recomendacoes(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data["analista"])
        
        # Nome da URL corrigido para "recomendacoes-list-create"
        url = reverse("recomendacoes-list-create", kwargs={
            "cliente_id": setup_data["cliente"].id,
            "formulario_id": setup_data["form_respondido"].id
        })
        response = client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["nome"] == "Test Recommendation"

    def test_create_recomendacao(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data["analista"])
        
        # Nome da URL corrigido para "recomendacoes-list-create"
        url = reverse("recomendacoes-list-create", kwargs={
            "cliente_id": setup_data["cliente"].id,
            "formulario_id": setup_data["form_respondido"].id
        })
        
        data = {
            "nome": "Nova Recomendação",
            "categoria": "Proteger (PR)",
            "tecnologia": "Tecnologia Y",
            "nist": "NIST-002",
            "prioridade": "media",
            "responsavel": "Equipe de Segurança",
            "data_inicio": date.today().isoformat(),
            "data_fim": (date.today() + timedelta(days=60)).isoformat(),
            "meses": 2,
            "detalhes": "Detalhes da nova recomendação",
            "investimentos": "Alto investimento",
            "urgencia": "4",
            "gravidade": "3"
        }
        
        response = client.post(url, data, format="json")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Recomendacao.objects.count() == 2
        assert response.data["analista"] == setup_data["analista"].id

    def test_retrieve_recomendacao(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data["analista"])
        
        # Nome da URL mantido como "recomendacao-detail" (singular)
        url = reverse("recomendacao-detail", kwargs={
            "pk": setup_data["recomendacao"].id
        })
        response = client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["nome"] == "Test Recommendation"

    def test_update_recomendacao(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data["analista"])
        
        # Nome da URL mantido como "recomendacao-detail" (singular)
        url = reverse("recomendacao-detail", kwargs={
            "pk": setup_data["recomendacao"].id
        })
        
        data = {
            "nome": "Recomendação Atualizada",
            "prioridade": "baixa",
            "responsavel": "Nova Equipe"
        }
        
        response = client.patch(url, data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        setup_data["recomendacao"].refresh_from_db()
        assert setup_data["recomendacao"].nome == "Recomendação Atualizada"
        assert setup_data["recomendacao"].prioridade == "baixa"

    def test_delete_recomendacao(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data["analista"])
        
        # Nome da URL mantido como "recomendacao-detail" (singular)
        url = reverse("recomendacao-detail", kwargs={
            "pk": setup_data["recomendacao"].id
        })
        
        response = client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Recomendacao.objects.count() == 0

    def test_unauthenticated_access(self, setup_data):
        client = APIClient()
        
        # Testar lista - nome corrigido
        list_url = reverse("recomendacoes-list-create", kwargs={
            "cliente_id": setup_data["cliente"].id,
            "formulario_id": setup_data["form_respondido"].id
        })
        response = client.get(list_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
        # Testar detalhe - nome mantido
        detail_url = reverse("recomendacao-detail", kwargs={
            "pk": setup_data["recomendacao"].id
        })
        response = client.get(detail_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED