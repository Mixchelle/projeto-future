import os
from pathlib import Path

# Configuração base
BASE_DIR = Path(__file__).resolve().parent.parent

# Configuração especial para desativar migrations durante testes
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None

# Verifica se está em modo de teste
TESTING = 'test' in sys.argv or os.environ.get('TEST', False)

if TESTING:
    # Configurações específicas para teste
    DEBUG = True
    
    # Desativa migrations
    MIGRATION_MODULES = DisableMigrations()
    
    # Configuração do banco de dados para testes
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
            'TEST': {
                'NAME': ':memory:',
                'MIRROR': None,  # Resolve o KeyError
            },
        }
    }
    
    # Acelera os testes de autenticação
    PASSWORD_HASHERS = [
        'django.contrib.auth.hashers.MD5PasswordHasher',
    ]
    
    # Desativa cache para testes
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }
else:
    # Configuração normal do banco de dados (não-teste)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'cybersec_db',
            'USER': 'postgres',
            'PASSWORD': 'dU2q4Lpm12@#$',
            'HOST': 'localhost',
            'PORT': '5432',
            'TEST': {
                'NAME': 'test_cybersec_db',
                'MIRROR': None,
                'TEMPLATE': 'template0',
            },
        }
    }

# Configurações comuns a ambos os ambientes
SECRET_KEY = 'sua-chave-secreta-aqui'  # Substitua por uma chave real
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
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

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'