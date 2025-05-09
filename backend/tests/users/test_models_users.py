import pytest
from users.models import CustomUser


@pytest.mark.django_db
class TestCustomUserModel:
    def test_create_user(self):
        user = CustomUser.objects.create_user(
            email="test@example.com",
            password="testpass123",
            nome="Test User"
        )
        assert user.email == "test@example.com"
        assert user.nome == "Test User"
        assert user.role == "cliente"
        assert str(user) == "Test User (test@example.com)"

    def test_create_superuser(self):
        admin = CustomUser.objects.create_superuser(
            email="admin@example.com",
            password="testpass123",
            nome="Admin User"
        )
        assert admin.is_staff
        assert admin.is_superuser