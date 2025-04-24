from django.test import TestCase
from .models import Formulario, Categoria, Pergunta

class FormularioTestCase(TestCase):
    def setUp(self):
        self.formulario = Formulario.objects.create(nome="Teste Formulário")

    def test_formulario_criado(self):
        self.assertEqual(self.formulario.nome, "Teste Formulário")

class CategoriaTestCase(TestCase):
    def setUp(self):
        self.formulario = Formulario.objects.create(nome="Teste Formulário")
        self.categoria = Categoria.objects.create(nome="Teste Categoria", formulario=self.formulario)

    def test_categoria_criada(self):
        self.assertEqual(self.categoria.nome, "Teste Categoria")

class PerguntaTestCase(TestCase):
    def setUp(self):
        self.formulario = Formulario.objects.create(nome="Teste Formulário")
        self.categoria = Categoria.objects.create(nome="Teste Categoria", formulario=self.formulario)
        self.pergunta = Pergunta.objects.create(texto="Teste Pergunta", codigo="P001", categoria=self.categoria, formulario=self.formulario)

    def test_pergunta_criada(self):
        self.assertEqual(self.pergunta.texto, "Teste Pergunta")
