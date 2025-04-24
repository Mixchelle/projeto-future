# tests/test_views.py
from django.urls import reverse
from rest_framework.test import APITestCase
from assessments.models import Question

class QuestionViewTest(APITestCase):
    def test_list_questions(self):
        Question.objects.create(text="Test question", category="GV", weight=1.0);
        response = self.client.get(reverse("question-list"));
        self.assertEqual(response.status_code, 200);
        self.assertEqual(len(response.data), 1);