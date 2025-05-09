from rest_framework.test import APITestCase
from form.models import Formulario, Categoria
from form.serializers import FormularioSerializer, CategoriaSerializer

class TestFormularioSerializer(APITestCase):
    def test_serializer(self):
        form = Formulario.objects.create(nome="Test Form")
        serializer = FormularioSerializer(form)
        assert serializer.data['nome'] == "Test Form"
        assert serializer.data['total'] == 0  # No questions yet

class TestCategoriaSerializer(APITestCase):
    def setUp(self):
        self.form = Formulario.objects.create(nome="Test Form")
    
    def test_serializer(self):
        cat = Categoria.objects.create(nome="Test Cat", formulario=self.form)
        serializer = CategoriaSerializer(cat)
        assert serializer.data['nome'] == "Test Cat"
        assert len(serializer.data['perguntas']) == 0