from django.test import TestCase
from django.urls import reverse
from django.core.cache import cache


class RateLimitingTests(TestCase):
    def test_rate_limit(self):
        # Simula múltiplos acessos rápidos
        for _ in range(6):
            response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'testpass'})
        
        # Após 5 tentativas, a resposta deve ser uma limitação de taxa (HTTP 429)
        self.assertEqual(response.status_code, 429)
