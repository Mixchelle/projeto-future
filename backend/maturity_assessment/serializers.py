from rest_framework import serializers
from .models import MaturityAssessment, CategoriaMaturity, SubcategoriaMaturity
from form.models import FormularioRespondido
from form.serializers import FormularioCompletoSerializer


class FormularioRespondidoSerializer(serializers.ModelSerializer):
    formulario_completo = serializers.SerializerMethodField()
    cliente = serializers.SerializerMethodField()

    class Meta:
        model = FormularioRespondido
        fields = [
            "id",
            "status",
            "progresso",
            "versao",
            "criado_em",
            "atualizado_em",
            "cliente",
            "formulario",
            "responsavel",
            "formulario_completo",
        ]
        depth = 1

    def get_cliente(self, obj):
        return {
            "id": obj.cliente.id,
            "nome": obj.cliente.nome
        }

    def get_formulario_completo(self, obj):
        serializer = FormularioCompletoSerializer(
            obj.formulario,
            context={
                "formulario_respondido": obj,
                "request": self.context.get("request"),
            },
        )
        return serializer.data

class SubcategoriaMaturitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="pergunta.codigo", read_only=True)
    subcategoria = serializers.CharField(source="descricao", read_only=True)
    tipo = serializers.CharField()

    class Meta:
        model = SubcategoriaMaturity
        fields = ["id", "subcategoria", "politica", "pratica", "objetivo", "tipo"]


class CategoriaMaturitySerializer(serializers.ModelSerializer):
    categoria = serializers.CharField(source="nome")
    sigla = serializers.CharField()
    media = serializers.DecimalField(
        source="media_total", max_digits=3, decimal_places=1
    )
    politica = serializers.DecimalField(
        source="media_politica", max_digits=3, decimal_places=1
    )
    pratica = serializers.DecimalField(
        source="media_pratica", max_digits=3, decimal_places=1
    )
    objetivo = serializers.DecimalField(max_digits=3, decimal_places=1)
    status = serializers.CharField()
    tipo = serializers.CharField()
    subcategorias = SubcategoriaMaturitySerializer(
        source="subcategorias_maturity", many=True, read_only=True
    )

    class Meta:
        model = CategoriaMaturity
        fields = [
            "categoria",
            "sigla",
            "media",
            "politica",
            "pratica",
            "objetivo",
            "status",
            "tipo",
            "subcategorias",
        ]


class MaturityAssessmentSerializer(serializers.ModelSerializer):
    funcoes = serializers.SerializerMethodField()
    formulario = FormularioRespondidoSerializer(source="formulario_respondido")

    class Meta:
        model = MaturityAssessment
        fields = ["funcoes", "formulario"]

    def get_funcoes(self, obj):
        # Agrupa por função
        funcoes = {}
        for categoria in obj.categorias_maturity.filter(tipo="FUNCAO"):
            funcoes[categoria.sigla] = {
                "nome": categoria.nome,
                "sigla": categoria.sigla,
                "media": categoria.media_total,
                "politica": categoria.media_politica,
                "pratica": categoria.media_pratica,
                "status": categoria.status,
                "categorias": CategoriaMaturitySerializer(
                    obj.categorias_maturity.filter(
                        tipo="CATEGORIA", sigla__startswith=categoria.sigla
                    ),
                    many=True,
                ).data,
            }
        return funcoes
