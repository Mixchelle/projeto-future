from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class PermissionsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.admin = User.objects.create_superuser(username='admin', password='adminpass')

    def test_access_restricted_view_without_permission(self):
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(reverse('create_report'))
        self.assertEqual(response.status_code, 403)  # Acesso negado

    def test_access_restricted_view_with_permission(self):
        self.client.login(username='admin', password='adminpass')
        response = self.client.get(reverse('create_report'))
        self.assertEqual(response.status_code, 200)  # Acesso permitido
