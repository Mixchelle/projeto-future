# tests/test_models.py
from django.test import TestCase
from assessments.models import Question, ControlAssessment

class QuestionModelTest(TestCase):
    def test_create_question(self):
        question = Question.objects.create(text="Test question", category="GV", weight=1.0)
        self.assertEqual(question.text, "Test question")