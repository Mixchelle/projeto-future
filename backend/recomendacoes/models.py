from django.db import models
from user.models import CustomUser
from form.models import FormularioRespondido

class Recomendacao(models.Model):
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="recomendacoes_cliente")
    formulario_respondido = models.ForeignKey(FormularioRespondido, on_delete=models.CASCADE, related_name="recomendacoes_formulario")
    recomendacao = models.CharField(max_length=255)
    detalhamento = models.TextField()
    responsavel = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="recomendacoes_responsavel")
    prazo = models.PositiveIntegerField(null=True, blank=True)
    categoria = models.CharField(max_length=255, null=True, blank=True)
    prioridade = models.CharField(max_length=50, null=True, blank=True)
    cumprida = models.BooleanField(default=False)
    data_cumprimento = models.DateField(null=True, blank=True)
    comprovante = models.FileField(upload_to='comprovantes/', null=True, blank=True)
    observacoes = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.recomendacao
