from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from assessments.models import Question, AssessmentResponse
from assessments.serializers import QuestionSerializer, AssessmentResponseSerializer
import decimal

User = get_user_model()

class TestQuestionSerializer(APITestCase):
    def test_serializer_valid(self):
        data = {
            "text": "Test question",
            "category": "GV",
            "weight": "1.00"
        }
        serializer = QuestionSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data['text'] == "Test question"
        assert serializer.validated_data['weight'] == decimal.Decimal('1.00')

    def test_serializer_invalid(self):
        data = {
            "text": "",
            "category": "XX",  # Invalid
            "weight": "-1"  # Invalid
        }
        serializer = QuestionSerializer(data=data)
        assert not serializer.is_valid()
        assert 'category' in serializer.errors
        assert 'text' in serializer.errors

class TestAssessmentResponseSerializer(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@example.com", password="testpass123")
        self.question = Question.objects.create(text="Test", category="GV")

    def test_serializer_valid(self):
        data = {
            "question": self.question.id,
            "politica": 3,
            "pratica": 4
        }
        serializer = AssessmentResponseSerializer(
            data=data, 
            context={'user': self.user}  # Passa o usuário no contexto
        )
        assert serializer.is_valid(), serializer.errors
        
        # Verifica se o user está nos dados validados
        assert 'user' not in serializer.validated_data  # Não deve estar ainda
        
        response = serializer.save()
        assert response.user == self.user
        assert response.question == self.question
        assert response.politica == 3
        assert response.pratica == 4