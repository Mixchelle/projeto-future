from django.test import TestCase

class SecurityHeadersTests(TestCase):
    def test_x_frame_options(self):
        response = self.client.get('/')
        self.assertEqual(response.headers['X-Frame-Options'], 'DENY')

    def test_content_security_policy(self):
        response = self.client.get('/')
        self.assertTrue('Content-Security-Policy' in response.headers)
