from django.db import models
from django.core.exceptions import ValidationError
from users.models import CustomUser
from form.models import FormularioRespondido


class Recomendacao(models.Model):
    CATEGORIA_CHOICES = [
        ("Governança", "Governança"),
        ("Identificação", "Identificação"),
        ("Proteção", "Proteção"),
        ("Detecção", "Detecção"),
        ("Resposta", "Resposta"),
        ("Recuperação", "Recuperação"),
    ]

    PRIORIDADE_CHOICES = [
        ("baixa", "Baixa"),
        ("media", "Média"),
        ("alta", "Alta"),
    ]

    IMPACTO_CHOICES = [
        ("1", "Muito Baixo"),
        ("2", "Baixo"),
        ("3", "Moderado"),
        ("4", "Alto"),
        ("5", "Muito Alto"),
    ]

    GRAVIDADE_CHOICES = [
        ("1", "Muito Baixa"),
        ("2", "Baixa"),
        ("3", "Moderada"),
        ("4", "Alta"),
        ("5", "Muito Alta"),
    ]

    cliente = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="recomendacoes_cliente",
        limit_choices_to={"role": "cliente"},
    )

    formulario_respondido = models.ForeignKey(
        FormularioRespondido,
        on_delete=models.CASCADE,
        related_name="recomendacoes_formulario",
    )

    analista = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recomendacoes_analista",
        # Removido limit_choices_to para evitar conflitos
    )

    # Campos principais
    nome = models.CharField(max_length=255)
    categoria = models.CharField(max_length=50, choices=CATEGORIA_CHOICES)
    tecnologia = models.CharField(max_length=255, blank=True, default="Agnóstico")
    nist = models.CharField(max_length=50)
    prioridade = models.CharField(max_length=50, choices=PRIORIDADE_CHOICES)

    # Datas e prazos
    data_inicio = models.DateField()
    data_fim = models.DateField()
    meses = models.PositiveIntegerField()

    # Detalhes
    detalhes = models.TextField()
    investimentos = models.CharField(max_length=255)
    riscos = models.TextField(blank=True, default="Não informado")
    justificativa = models.TextField(blank=True, default="Não informado")
    observacoes = models.TextField(blank=True, default="Nenhuma observação adicional")

    # Avaliação
    impacto = models.CharField(max_length=1, choices=IMPACTO_CHOICES)
    gravidade = models.CharField(max_length=1, choices=GRAVIDADE_CHOICES)

    # Status
    cumprida = models.BooleanField(default=False)
    data_cumprimento = models.DateField(null=True, blank=True)
    comprovante = models.FileField(upload_to="comprovantes/", null=True, blank=True)

    # Metadata
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Recomendação"
        verbose_name_plural = "Recomendações"
        ordering = ["-prioridade", "data_fim"]

    def __str__(self):
        return (
            f"{self.nome} - {self.get_prioridade_display()} (Cliente: {self.cliente})"
        )

    def clean(self):
        # Validação de datas
        if self.data_inicio and self.data_fim and self.data_inicio > self.data_fim:
            raise ValidationError(
                "A data de início deve ser anterior à data de término."
            )

        # Validação de meses
        if self.meses <= 0:
            raise ValidationError("O prazo em meses deve ser maior que zero.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
