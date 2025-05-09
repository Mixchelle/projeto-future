from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from assessments.models import Question
from django.urls import reverse

User = get_user_model()

class TestQuestionViewSet(APITestCase):
    databases = {'default'}  # Especifica quais bancos de dados usar

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            email="admin@example.com", 
            password="testpass123", 
            is_staff=True
        )
        cls.question = Question.objects.create(
            text="Test question", 
            category="GV",
            weight="1.00"
        )

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list_questions(self):
        url = reverse('question-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_question_api(self):
        url = reverse('question-list')
        data = {
            "text": "New question",
            "category": "ID",
            "weight": "1.50"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Question.objects.count(), 2)

    def test_by_category_endpoint(self):
        Question.objects.create(
            text="Another question",
            category="ID",
            weight="1.00"
        )
        url = reverse('questions-by-category')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('GV', response.data)
        self.assertIn('ID', response.data)