from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class AssessmentResponse(models.Model):
    LEVEL_CHOICES = [
        (1, 'Inicial'),
        (2, 'Repetido'),
        (3, 'Definido'),
        (4, 'Gerenciado'),
        (5, 'Otimizado'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    politica = models.IntegerField(choices=LEVEL_CHOICES)
    pratica = models.IntegerField(choices=LEVEL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'question')

    def __str__(self):
        return f"{self.user.username} - {self.question.text}"

class Question(models.Model):
    CATEGORY_CHOICES = [
        ("GV", "Govern"),
        ("ID", "Identity"),
        ("PR", "Protect"),
        ("DE", "Detect"),
        ("RS", "Response"),
        ("RC", "Recovery"),
    ]

    LEVEL_CHOICES = [
        (1, "Inicial"),
        (2, "Gerenciado"),
        (3, "Definido"),
        (4, "Repetido"),
        (5, "Otimizado"),
    ]

    text = models.TextField()  # Texto da pergunta
    category = models.CharField(max_length=1000, choices=CATEGORY_CHOICES)
    weight = models.DecimalField(max_digits=500, decimal_places=2, default=1.0)  # Peso da pergunta

    def __str__(self):
        return f"{self.get_category_display()} - {self.text[:30]}..."
    

class Assessment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='core_assessments')

    def __str__(self):
        return f"Assessment by {self.user.username}"


class ControlAssessment(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'Em progresso'),
        ('completed', 'Concluído'),
        ('pending', 'Pendente'),
    ]
    
    CATEGORY_CHOICES = [
        ('security', 'Segurança'),
        ('privacy', 'Privacidade'),
        ('compliance', 'Compliance'),
    ]
    
    title = models.CharField(max_length=255, blank=True, null=True)  # Opcional
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True)  # Opcional
    score = models.FloatField(blank=True, null=True)  # Opcional
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, blank=True, null=True)  # Opcional
    date = models.DateField(blank=True, null=True)  # Opcional
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='control_assessments')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='assessments')
    policy_maturity = models.IntegerField(choices=Question.LEVEL_CHOICES, blank=True, null=True)  # Opcional
    practice_maturity = models.IntegerField(choices=Question.LEVEL_CHOICES, blank=True, null=True)  # Opcional
    created_at = models.DateTimeField(auto_now_add=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Pontuação total

    def __str__(self):
        return self.title or f"{self.question.category} - {self.question.text[:30]}..."

    def calculate_score(self):
        if self.policy_maturity and self.practice_maturity and self.question.weight:
            policy_score = self.policy_maturity * self.question.weight
            practice_score = self.practice_maturity * self.question.weight
            self.score = (policy_score + practice_score) / 2  # Média simples
            self.save()


class RiskAssessment(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField()
    score = models.IntegerField()
    category = models.CharField(max_length=100, choices=[('high', 'Alta'), ('medium', 'Média'), ('low', 'Baixa')])
    assessment_date = models.DateField()

    def __str__(self):
        return self.name


class Answer(models.Model):
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text[:50]  # Retorna os primeiros 50 caracteres da resposta
