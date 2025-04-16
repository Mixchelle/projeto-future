from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class AuthenticationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_login_successful(self):
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Logout')

    def test_login_unsuccessful(self):
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'wrongpass'})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Invalid credentials')

    def test_logout(self):
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(reverse('logout'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Login')
