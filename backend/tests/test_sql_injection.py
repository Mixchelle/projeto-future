from django.test import TestCase
from django.urls import reverse
from users.models import CustomUser

class SQLInjectionTests(TestCase):
    def test_sql_injection(self):
        response = self.client.get(reverse('user_list') + "?username=' OR '1'='1")
        self.assertNotContains(response, "error")
        self.assertEqual(response.status_code, 200)
