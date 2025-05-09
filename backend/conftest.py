import pytest
from django.conf import settings

@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """Habilita acesso ao banco de dados para todos os testes"""
    pass

@pytest.fixture(scope='session')
def django_db_setup():
    """Configuração do banco de dados para testes"""
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
        'ATOMIC_REQUESTS': False,
    }