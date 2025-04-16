from django.db import models


class Formulario(models.Model):
    nome = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nome


class Categoria(models.Model):
    nome = models.CharField(max_length=255, unique=True)
    formulario = models.ForeignKey(
        Formulario, on_delete=models.CASCADE, related_name="categorias"
    )

    def __str__(self):
        return self.nome


class Pergunta(models.Model):
    questao = models.TextField()
    codigo = models.CharField(max_length=50, unique=True)
    categoria = models.ForeignKey(
        Categoria, on_delete=models.CASCADE, related_name="perguntas"
    )
    formulario = models.ForeignKey(
        Formulario,
        on_delete=models.CASCADE,
        related_name="perguntas",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.questao


class FormularioRespondido(models.Model):
    STATUS_CHOICES = [
        ("rascunho", "Rascunho"),
        ("analise", "Em Análise"),
        ("concluido", "Concluído"),
    ]

    cliente = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.CASCADE,
        related_name="formularios_respondidos",
    )
    formulario = models.ForeignKey(
        Formulario, on_delete=models.CASCADE, related_name="formularios_respondidos"
    )
    responsavel = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="formularios_designados",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="rascunho")
    progresso = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    versao = models.PositiveIntegerField(default=1)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("cliente", "formulario", "versao")

    def __str__(self):
        return f"{self.formulario.nome} - {self.cliente.email} (v{self.versao})"


class Resposta(models.Model):
    formulario_respondido = models.ForeignKey(
        FormularioRespondido, on_delete=models.CASCADE, related_name="respostas"
    )
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE)
    usuario = models.ForeignKey(
        "users.CustomUser", on_delete=models.SET_NULL, null=True
    )
    politica = models.TextField(blank=True, null=True)
    pratica = models.TextField(blank=True, null=True)
    info_complementar = models.TextField(blank=True, null=True)
    anexos = models.FileField(upload_to="anexos/", blank=True, null=True)

    respondido_em = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("formulario_respondido", "pergunta")

    def __str__(self):
        return f"{self.pergunta.codigo} - {self.formulario_respondido.id}"
