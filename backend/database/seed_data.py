import os
import sys
import django

# Defina corretamente o caminho BASE_DIR
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Configure o Django corretamente
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# Agora inicialize o Django
django.setup()

# Importação só depois do setup
from assessments.models import Question

QUESTIONS = [
    {"category": "Governar", "text": "A empresa possui uma política de privacidade e proteção de dados formalmente documentada?"},
    {"category": "Identificar", "text": "A empresa identificou todos os tipos de dados pessoais que coleta, processa e armazena?"},
    {"category": "Proteger", "text": "A empresa implementou controles de acesso para garantir que apenas pessoas autorizadas tenham acesso a dados pessoais?"},
    {"category": "Detectar", "text": "A empresa possui sistemas de monitoramento contínuo para detectar atividades incomuns ou acessos não autorizados a dados pessoais?"},
    {"category": "Responder", "text": "A empresa possui um plano de resposta a incidentes de segurança que inclui violações de dados pessoais?"},
    {"category": "Recuperar", "text": "A empresa possui um plano de recuperação de desastres (DRP) que inclui a recuperação de dados pessoais?"},
]

def seed_questions():
    for data in QUESTIONS:
        Question.objects.get_or_create(category=data["category"], text=data["text"])
    print("✅ Questões adicionadas ao banco de dados!")

if __name__ == "__main__":
    seed_questions()
