from django.test import TestCase
from django.urls import reverse

class CSRFTests(TestCase):
    def test_csrf_token_present_in_form(self):
        response = self.client.get(reverse('create_report'))
        self.assertContains(response, 'csrfmiddlewaretoken')

    def test_invalid_csrf_token(self):
        response = self.client.post(reverse('create_report'), {}, HTTP_X_CSRFTOKEN='invalid_token')
        self.assertEqual(response.status_code, 403)  # CSRF violado
