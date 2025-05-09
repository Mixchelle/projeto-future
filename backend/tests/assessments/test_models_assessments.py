import pytest
from django.contrib.auth import get_user_model
from assessments.models import Question, AssessmentResponse

User = get_user_model()

@pytest.mark.django_db
class TestQuestionModel:
    def test_create_question(self):
        question = Question.objects.create(
            text="Test question text",
            category="GV",
            weight=1.5
        )
        assert question.text == "Test question text"
        assert question.get_category_display() == "Govern"
        # Ajustado para incluir os três pontos no final ou removê-los do modelo
        assert str(question) == "Govern - Test question text..."  # Ou ajuste o modelo