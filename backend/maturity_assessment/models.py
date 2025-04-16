from django.db import models
from form.models import FormularioRespondido, Categoria, Pergunta


class MaturityAssessment(models.Model):
    formulario_respondido = models.OneToOneField(
        FormularioRespondido,
        on_delete=models.CASCADE,
        related_name="maturity_assessment",
    )
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Avaliação de Maturidade"
        verbose_name_plural = "Avaliações de Maturidade"

    def __str__(self):
        return f"Avaliação de Maturidade para {self.formulario_respondido}"


class CategoriaMaturity(models.Model):
    TIPO_CHOICES = [
        ("FUNCAO", "Função"),
        ("CATEGORIA", "Categoria"),
    ]

    maturity_assessment = models.ForeignKey(
        MaturityAssessment, on_delete=models.CASCADE, related_name="categorias_maturity"
    )
    categoria = models.ForeignKey(
        Categoria, on_delete=models.SET_NULL, null=True, blank=True
    )
    nome = models.CharField(max_length=100)
    sigla = models.CharField(max_length=10)
    media_politica = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    media_pratica = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    media_total = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    objetivo = models.DecimalField(max_digits=3, decimal_places=1, default=3.0)
    status = models.CharField(max_length=20, default="Não Avaliado")
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default="CATEGORIA")

    class Meta:
        ordering = ["tipo", "sigla"]


class SubcategoriaMaturity(models.Model):
    TIPO_CHOICES = [
        ("SUBCATEGORIA", "Subcategoria"),
        ("PERGUNTA", "Pergunta"),
    ]

    categoria_maturity = models.ForeignKey(
        CategoriaMaturity,
        on_delete=models.CASCADE,
        related_name="subcategorias_maturity",
    )
    pergunta = models.ForeignKey(
        Pergunta, on_delete=models.CASCADE, null=True, blank=True
    )
    politica = models.DecimalField(
        max_digits=3, decimal_places=1, null=True, blank=True
    )
    pratica = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    objetivo = models.DecimalField(max_digits=3, decimal_places=1, default=3.0)
    descricao = models.TextField()
    tipo = models.CharField(max_length=12, choices=TIPO_CHOICES, default="PERGUNTA")
