from rest_framework.test import APITestCase
from form.models import Formulario, FormularioRespondido
from users.models import CustomUser
from maturity_assessment.serializers import MaturityAssessmentSerializer

class TestMaturityAssessmentSerializer(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email="test@example.com", password="testpass123")
        self.form = Formulario.objects.create(nome="Test Form")
        self.form_respondido = FormularioRespondido.objects.create(
            formulario=self.form,
            cliente=self.user
        )
    
    def test_serializer(self):
        from maturity_assessment.models import MaturityAssessment
        assessment = MaturityAssessment.objects.create(
            formulario_respondido=self.form_respondido
        )
        serializer = MaturityAssessmentSerializer(assessment)
        assert 'funcoes' in serializer.data
        assert 'formulario' in serializer.data