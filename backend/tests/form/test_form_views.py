import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from users.models import CustomUser
from form.models import Formulario, Categoria, Pergunta, FormularioRespondido, Resposta


@pytest.mark.django_db
class TestFormularioCompletoView:

    @pytest.fixture
    def setup_data(self):
        # Criando um usuário
        user = CustomUser.objects.create_user(
            username="cliente", 
            email="cliente@example.com",
            password="123456", 
            id=1
        )
        
        # Criando o formulário
        form = Formulario.objects.create(nome="Teste Formulário")
        
        # Criando a categoria dentro do formulário
        categoria = Categoria.objects.create(nome="Cat 1", formulario=form)
        
        # Criando a pergunta na categoria com os campos corretos
        pergunta = Pergunta.objects.create(
            categoria=categoria,
            questao="Texto da pergunta 1",
            codigo="P001",
            formulario=form
        )
        
        return {"user": user, "form": form, "categoria": categoria, "pergunta": pergunta}

    def test_get_formulario_completo_sem_parametros(self, setup_data):
        client = APIClient()
        user = setup_data["user"]
        client.force_authenticate(user=user)

        url = reverse("formulario-completo", kwargs={"cliente_id": "0", "form_id": "0"})
        response = client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_formulario_completo_com_autorizacao(self, setup_data):
        client = APIClient()
        user = setup_data["user"]
        form = setup_data["form"]
        client.force_authenticate(user=user)

        url = reverse("formulario-completo", kwargs={"cliente_id": user.id, "form_id": form.id})
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert "nome" in response.data

    def test_post_formulario_criando_versao_1(self, setup_data):
        client = APIClient()
        user = setup_data["user"]
        form = setup_data["form"]
        pergunta = setup_data["pergunta"]

        client.force_authenticate(user=user)

        url = reverse("formulario-completo", kwargs={"cliente_id": user.id, "form_id": form.id})

        payload = {
            "responsavel": user.id,
            "respostas": [
                {
                    "pergunta": pergunta.id,
                    "politica": "Sim",
                    "pratica": "Implementada",
                    "info_complementar": "Alguma info",
                }
            ],
            "status": "rascunho",
        }

        response = client.post(url, data=payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["versao"] == 1
        assert response.data["created"] is True

    def test_post_formulario_com_nova_versao_sem_concluir_versao1(self, setup_data):
        client = APIClient()
        user = setup_data["user"]
        form = setup_data["form"]
        pergunta = setup_data["pergunta"]

        client.force_authenticate(user=user)

        # Cria versão 1 como rascunho
        FormularioRespondido.objects.create(
            formulario=form, 
            cliente=user, 
            responsavel=user, 
            versao=1, 
            status="rascunho"
        )

        url = reverse("formulario-completo", kwargs={"cliente_id": user.id, "form_id": form.id})

        payload = {
            "responsavel": user.id,
            "nova_versao": True,
            "respostas": [
                {
                    "pergunta": pergunta.id,
                    "politica": "Sim",
                    "pratica": "Implementada",
                    "info_complementar": "Detalhes",
                }
            ],
        }

        response = client.post(url, data=payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "versão 1 deve estar concluída" in response.data["error"]