import pytest
from form.models import Formulario, Categoria, Pergunta

@pytest.mark.django_db
class TestFormularioModel:
    def test_formulario_creation(self):
        formulario = Formulario.objects.create(nome="Teste Formulário")
        assert formulario.nome == "Teste Formulário"
        assert str(formulario) == "Teste Formulário"

@pytest.mark.django_db
class TestCategoriaModel:
    def test_categoria_creation(self):
        formulario = Formulario.objects.create(nome="Teste Formulário")
        categoria = Categoria.objects.create(
            nome="Teste Categoria",
            formulario=formulario
        )
        assert categoria.nome == "Teste Categoria"
        assert categoria.formulario == formulario
        assert str(categoria) == "Teste Categoria"

@pytest.mark.django_db
class TestPerguntaModel:
    def test_pergunta_creation(self):
        formulario = Formulario.objects.create(nome="Teste Formulário")
        categoria = Categoria.objects.create(
            nome="Teste Categoria",
            formulario=formulario
        )
        pergunta = Pergunta.objects.create(
            questao="Teste Pergunta",  # Campo correto conforme seu models.py
            codigo="P001",
            categoria=categoria,
            formulario=formulario
        )
        assert pergunta.questao == "Teste Pergunta"
        assert pergunta.codigo == "P001"
        assert pergunta.categoria == categoria
        assert pergunta.formulario == formulario
        assert str(pergunta) == "Teste Pergunta"