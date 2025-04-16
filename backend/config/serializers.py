from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
import logging

logger = logging.getLogger(__name__)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Mantemos o campo username e adicionamos email como opcional
        self.fields["email"] = serializers.EmailField(required=False)

    def validate(self, attrs):
        # Extrai email ou username
        email = attrs.get("email")
        username = attrs.get("username")
        password = attrs.get("password")

        logger.info(f"Tentando login com email/username: {email or username}")

        # Validações básicas
        if not (email or username):
            raise serializers.ValidationError(
                {"error": "Você deve fornecer 'username' ou 'email'"}
            )

        if not password:
            raise serializers.ValidationError(
                {"password": "O campo password é obrigatório."}
            )

        # Busca o usuário
        User = get_user_model()
        try:
            # Tenta encontrar por email se fornecido, senão por username
            if email:
                user = User.objects.filter(email=email).first()
                if not user:
                    logger.warning(f"Usuário com email {email} não encontrado!")
                    raise serializers.ValidationError(
                        {"email": "Nenhum usuário encontrado com este email."}
                    )
            else:
                user = User.objects.filter(username=username).first()
                if not user:
                    logger.warning(f"Usuário com username {username} não encontrado!")
                    raise serializers.ValidationError(
                        {"username": "Nenhum usuário encontrado com este username."}
                    )

            if not user.check_password(password):
                logger.warning(
                    f"Senha incorreta para o usuário {user.email or user.username}"
                )
                raise serializers.ValidationError({"password": "Senha incorreta."})

        except Exception as e:
            logger.error(f"Erro ao buscar usuário: {str(e)}")
            raise serializers.ValidationError({"error": "Erro interno no servidor"})

        logger.info(f"Login bem-sucedido para {user.email or user.username}")

        # Prepara os dados no formato que o SimpleJWT espera
        validated_data = {
            get_user_model().USERNAME_FIELD: email or username,
            "password": password,
        }

        # Chama a validação original para obter os tokens
        data = super().validate(validated_data)

        # Adiciona TODOS os dados do usuário à resposta
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "nome": user.nome,  # Campo personalizado do seu modelo
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "date_joined": user.date_joined,
            "last_login": user.last_login,
            # Adicione outros campos personalizados conforme necessário
        }

        # Se você quiser incluir informações sobre o cliente relacionado (se existir)
        if user.cliente:
            data["user"]["cliente"] = {
                "id": user.cliente.id,
                "nome": user.cliente.nome,
                "email": user.cliente.email,
            }

        return data
