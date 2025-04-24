from cryptography.fernet import Fernet
from django.test import TestCase
from users.models import CustomUser

class EncryptionTests(TestCase):
    def setUp(self):
        # Gerar chave de criptografia
        self.key = Fernet.generate_key()
        self.cipher = Fernet(self.key)

    def test_encryption(self):
        sensitive_data = "Sensitive Information"
        encrypted_data = self.cipher.encrypt(sensitive_data.encode())
        decrypted_data = self.cipher.decrypt(encrypted_data).decode()

        self.assertEqual(sensitive_data, decrypted_data)
