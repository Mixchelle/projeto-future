import bleach
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, Group, Permission

# Frameworks de segurança (NIST, CIS, ISO, etc.)
class Framework(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

# Categorias de controles dentro de cada framework
class ControlCategory(models.Model):
    name = models.CharField(max_length=100)
    framework = models.ForeignKey(Framework, on_delete=models.CASCADE, related_name="categories")

    def __str__(self):
        return f"{self.framework.name} - {self.name}"

# Perguntas para avaliar os controles
class Question(models.Model):
    text = models.TextField()
    category = models.ForeignKey(ControlCategory, on_delete=models.CASCADE, related_name="questions")
    
    def __str__(self):
        return self.text

# Respostas possíveis para cada pergunta (níveis de maturidade)
MATURITY_LEVELS = [
    (1, "Inicial"),
    (2, "Gerenciado"),
    (3, "Definido"),
    (4, "Repetível"),
    (5, "Otimizado"),
]

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Corrigido aqui
    maturity_level = models.IntegerField(choices=MATURITY_LEVELS)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.question.text[:50]}: {self.get_maturity_level_display()}"

# Avaliação consolidada para cada organização/usuário
class Assessment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Corrigido aqui
    framework = models.ForeignKey(Framework, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def calculate_average_maturity(self):
        answers = Answer.objects.filter(user=self.user, question__category__framework=self.framework)
        if answers.exists():
            return sum(a.maturity_level for a in answers) / answers.count()
        return 0
    
    def __str__(self):
        return f"Assessment by {self.user.username} for {self.framework.name}"


def sanitize_html(input_html):
    allowed_tags = ['b', 'i', 'u', 'strong', 'em', 'p', 'br']
    return bleach.clean(input_html, tags=allowed_tags)

class Assessment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def save(self, *args, **kwargs):
        self.description = sanitize_html(self.description)
        super().save(*args, **kwargs)


# Modelo de usuário customizado
class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Administrator'),
        ('evaluator', 'Evaluator'),
        ('client', 'Client'),
    )

    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='client')

    groups = models.ManyToManyField(
        Group,
        related_name='core_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='core_user_permissions',
        blank=True
    )

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Salvar primeiro para garantir que o usuário já existe

        if self.user_type == 'admin':
            self.is_staff = True
            self.is_superuser = True
        elif self.user_type == 'evaluator':
            self.is_staff = True
        else:
            self.is_staff = False
            self.is_superuser = False


from cryptography.fernet import Fernet

def encrypt_data(data: str, key: str) -> bytes:
    fernet = Fernet(key.encode())
    return fernet.encrypt(data.encode())

def decrypt_data(data: bytes, key: str) -> str:
    fernet = Fernet(key.encode())
    return fernet.decrypt(data).decode()

# Modelo de perfil do usuário com criptografia de CPF
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    encrypted_cpf = models.BinaryField()

    def set_cpf(self, cpf: str):
        self.encrypted_cpf = encrypt_data(cpf, settings.SECRET_KEY)

    def get_cpf(self) -> str:
        return decrypt_data(self.encrypted_cpf, settings.SECRET_KEY)


# Modelo de avaliação
class Assessment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='assessments', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# Modelo de relatório
class Report(models.Model):
    assessment = models.ForeignKey(Assessment, related_name='reports', on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Report for {self.assessment.title}'


# Modelo de conformidade
class Compliance(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    standard_link = models.URLField()

    def __str__(self):
        return self.name