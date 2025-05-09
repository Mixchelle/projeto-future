import os
from pathlib import Path
import bleach
from datetime import timedelta
from django.db import models

# Configurações para testes no CI
if os.environ.get('GITHUB_ACTIONS') == 'true':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'cybersec_db',
            'USER': 'postgres',
            'PASSWORD': 'dU2q4Lpm12@#$',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }

# Configurações do drf-yasg para suprimir warnings
SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': False,
    'SECURITY_DEFINITIONS': None,
    'VALIDATOR_URL': None,
}
SWAGGER_USE_COMPAT_RENDERERS = False  # Isso resolve o warning específico do formato

# Configuração para evitar warnings de URL
SILENCED_SYSTEM_CHECKS = [
    'rest_framework.W001',  # Silencia warnings sobre configurações de paginação
]

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

user_input = "<default value>"  # Define user_input with a default value or get it from a secure source
clean_html = bleach.clean(user_input)

ROOT_URLCONF = "config.urls"  # Certifique-se de que está assim

AUTH_USER_MODEL = "users.CustomUser"


# Configuração correta do AUTHENTICATION_BACKENDS
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",  # Deve vir antes do ModelBackend
    "django.contrib.auth.backends.ModelBackend",
]

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-6ju2dr8-#u-()jr87xfm+(^o_rv0r)=#@oxy#jjv+&-@(r5-b6"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Desativar a segurança HTTPS no desenvolvimento
SECURE_SSL_REDIRECT = False  # Não redirecionar automaticamente para HTTPS
SECURE_HSTS_SECONDS = 0
SESSION_COOKIE_SECURE = False  # Permitir cookies em HTTP
CSRF_COOKIE_SECURE = False  # Permitir CSRF em HTTP

ALLOWED_HOSTS = ["*"]

# CSRF_COOKIE_SECURE = True
CSRF_USE_SESSIONS = True
SESSION_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False

SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"  # Previne Clickjacking
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 ano
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Application definition
AXES_FAILURE_LIMIT = 5  # Bloqueia usuário após 5 tentativas falhas

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "core",
    "rest_framework",
    "rest_framework_simplejwt",
    "assessments",
    "axes",
    "django_extensions",
    "users",
    "form",
    "drf_yasg",  # Swagger
    "maturity_assessment",
    "recomendacoes",
]

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'Ex: Token <seu_token> ou Bearer <seu_token>',
        }
    },
    'USE_SESSION_AUTH': False,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "SIGNING_KEY": SECRET_KEY,  # Usa a SECRET_KEY do Django
    "AUTH_HEADER_TYPES": ("Bearer",),
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",  # ESSENCIAL
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
        "rest_framework.permissions.AllowAny",
    ),
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS
    "axes.middleware.AxesMiddleware",  # Middleware do django-axes
]

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",  # Adiciona a URL do frontend
# ]
CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "cybersec_db"),
        "USER": os.getenv("POSTGRES_USER", "postgres"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "dU2q4Lpm12@#$"),
        "HOST": os.getenv(
            "POSTGRES_HOST", "localhost"
        ),  # usa 'db' no Docker e 'localhost' fora
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/
LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# CSRF_COOKIE_SECURE = True  # ✅ Garante que o cookie só seja enviado via HTTPS
CSRF_COOKIE_HTTPONLY = True  # ✅ Evita que JavaScript acesse o cookie CSRF
CSRF_TRUSTED_ORIGINS = [
    "https://seu-dominio.com"
]  # 🔹 Substitua pelo domínio do seu projeto

SECURE_BROWSER_XSS_FILTER = True  # ✅ Proteção contra XSS
X_FRAME_OPTIONS = "DENY"  # ✅ Bloqueia ataques de Clickjacking
SECURE_CONTENT_TYPE_NOSNIFF = (
    True  # ✅ Evita que o navegador detecte tipos de arquivos errados
)

# SECURE_SSL_REDIRECT = True  # ✅ Redireciona HTTP → HTTPS
# SECURE_HSTS_SECONDS = 31536000  # 🔹 1 ano de HSTS
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True  # 🔹 Inclui subdomínios
# SECURE_HSTS_PRELOAD = True  # 🔹 Permite que o navegador pré-carregue a política

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ✅ Detecta tentativas de login repetidas e gera alertas.
MIDDLEWARE.append("core.middleware.SuspiciousActivityMiddleware")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": "WARNING",
            "class": "logging.FileHandler",
            "filename": "logs/security.log",  # Arquivo onde os logs serão salvos
            "formatter": "verbose",
        },
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django.security": {
            "handlers": ["file"],
            "level": "WARNING",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["file"],
            "level": "ERROR",
            "propagate": True,
        },
    },
}
