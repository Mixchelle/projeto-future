from rest_framework import serializers
from .models import Formulario, Categoria, FormularioRespondido, Pergunta, Resposta


class PerguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pergunta
        fields = "__all__"


class CategoriaSerializer(serializers.ModelSerializer):
    perguntas = PerguntaSerializer(
        many=True, read_only=True
    )  # Retorna detalhes das perguntas

    class Meta:
        model = Categoria
        fields = "__all__"


class FormularioSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()

    class Meta:
        model = Formulario
        fields = ["id", "nome", "total"]

    def get_total(self, obj):
        # Retorna o total de perguntas diretamente relacionadas ao formulário
        return Pergunta.objects.filter(formulario=obj).count()


class RespostaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resposta
        fields = ["pergunta", "politica", "pratica", "info_complementar", "anexos"]


class PerguntaSerializer(serializers.ModelSerializer):
    resposta = serializers.SerializerMethodField()

    class Meta:
        model = Pergunta
        fields = ["id", "questao", "codigo", "resposta"]

    def get_resposta(self, obj):
        formulario_respondido = self.context.get("formulario_respondido")
        if formulario_respondido:
            resposta = Resposta.objects.filter(
                formulario_respondido=formulario_respondido, pergunta=obj
            ).first()
            if resposta:
                return RespostaSerializer(resposta).data
        return None


class CategoriaSerializer(serializers.ModelSerializer):
    perguntas = PerguntaSerializer(many=True)

    class Meta:
        model = Categoria
        fields = ["id", "nome", "perguntas"]


class FormularioCompletoSerializer(serializers.ModelSerializer):
    categorias = CategoriaSerializer(many=True)

    class Meta:
        model = Formulario
        fields = ["id", "nome", "categorias"]


class FormularioRespondidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormularioRespondido
        fields = [
            "id",
            "formulario",
            "cliente",
            "status",
            "progresso",
            "versao",
            "criado_em",
            "observacoes_pendencia",
        ]


# No arquivo serializers.py, adicione:
class FormularioRespondidoListSerializer(serializers.ModelSerializer):
    formulario_nome = serializers.CharField(source="formulario.nome", read_only=True)

    class Meta:
        model = FormularioRespondido
        fields = [
            "id",
            "formulario",
            "formulario_nome",
            "status",
            "atualizado_em",
            "versao",
            "progresso",
        ]
