from django.test import TestCase
from django.urls import reverse
from django.utils.html import escape

class XSSTests(TestCase):
    def test_xss_attack(self):
        malicious_input = "<script>alert('XSS Attack!');</script>"
        response = self.client.post(reverse('create_report'), {'report_data': malicious_input})
        
        # Verifique se a entrada maliciosa foi escapada corretamente
        self.assertNotContains(response, malicious_input)
        self.assertContains(response, escape(malicious_input))
