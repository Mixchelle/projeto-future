from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, generics
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


from .serializers import (
    FormularioRespondidoSerializer,
    FormularioSerializer,
    CategoriaSerializer,
    PerguntaSerializer,
    FormularioCompletoSerializer,
    FormularioRespondidoListSerializer,
)

from .models import Formulario, Categoria, Pergunta, FormularioRespondido, Resposta
from users.models import CustomUser


class FormularioViewSet(viewsets.ModelViewSet):
    queryset = Formulario.objects.all()
    serializer_class = FormularioSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class PerguntaViewSet(viewsets.ModelViewSet):
    queryset = Pergunta.objects.all()
    serializer_class = PerguntaSerializer


class CategoriasByFormularioView(generics.ListAPIView):
    serializer_class = CategoriaSerializer

    def get_queryset(self):
        formulario_id = self.kwargs["formulario_id"]
        return Categoria.objects.filter(formulario_id=formulario_id)


class PerguntasByCategoriaView(generics.ListAPIView):
    serializer_class = PerguntaSerializer

    def get_queryset(self):
        categoria_id = self.kwargs["categoria_id"]
        return Pergunta.objects.filter(categoria_id=categoria_id)


class FormularioCompletoView(APIView):

    def get(self, request, cliente_id=None, form_id=None):
        """Retorna formulário com respostas existentes ou vazio"""
        try:
            if not cliente_id or not form_id:
                return Response(
                    {"error": "IDs do cliente e formulário são obrigatórios"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if request.user.id != int(cliente_id) and not request.user.is_staff:
                return Response(
                    {"error": "Você não tem permissão para acessar este recurso"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            formulario = get_object_or_404(Formulario, id=form_id)
            cliente = get_object_or_404(CustomUser, id=cliente_id)

            # Busca a última versão do formulário respondido
            formulario_respondido = (
                FormularioRespondido.objects.filter(
                    formulario=formulario, cliente=cliente
                )
                .order_by("-versao")
                .first()
            )

            serializer = FormularioCompletoSerializer(
                formulario,
                context={
                    "formulario_respondido": formulario_respondido,
                    "request": request,
                },
            )
            return Response(serializer.data)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, cliente_id=None, form_id=None):
        """Cria ou atualiza um formulário respondido"""
        try:
            if not cliente_id or not form_id:
                return Response(
                    {"error": "IDs do cliente e formulário são obrigatórios"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if request.user.id != int(cliente_id) and not request.user.is_staff:
                return Response(
                    {"error": "Você não tem permissão para realizar esta ação"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            formulario = get_object_or_404(Formulario, id=form_id)
            cliente = get_object_or_404(CustomUser, id=cliente_id)
            respostas_data = request.data.get("respostas", [])
            status_form = request.data.get("status", "rascunho")

            # Verifica se está tentando criar nova versão
            criar_nova_versao = request.data.get("nova_versao", False)

            # Busca a versão 1
            versao_1 = FormularioRespondido.objects.filter(
                formulario=formulario, cliente=cliente, versao=1
            ).first()

            if criar_nova_versao:
                # Só permite nova versão se a versão 1 estiver concluída
                if not versao_1 or versao_1.status != "concluido":
                    return Response(
                        {
                            "error": "Não é possível criar nova versão. A versão 1 deve estar concluída."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Determina o número da nova versão (2, 3, etc.)
                ultima_versao = (
                    FormularioRespondido.objects.filter(
                        formulario=formulario, cliente=cliente
                    )
                    .order_by("-versao")
                    .first()
                )

                nova_versao = ultima_versao.versao + 1 if ultima_versao else 2

                # Cria nova versão
                formulario_respondido = FormularioRespondido.objects.create(
                    formulario=formulario,
                    cliente=cliente,
                    responsavel_id=request.data.get("responsavel"),
                    status="rascunho",
                    versao=nova_versao,
                )
                created = True
            else:
                # Se não for nova versão, usa a versão 1 (cria se não existir)
                if not versao_1:
                    formulario_respondido = FormularioRespondido.objects.create(
                        formulario=formulario,
                        cliente=cliente,
                        responsavel_id=request.data.get("responsavel"),
                        status=status_form,
                        versao=1,
                    )
                    created = True
                else:
                    # Atualiza a versão 1 se for rascunho
                    if versao_1.status != ["rascunho", "pendente"]:
                        return Response(
                            {
                                "error": "Só é possível editar formulários com status 'rascunho'"
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    versao_1.responsavel_id = request.data.get("responsavel")
                    versao_1.status = status_form
                    versao_1.save()
                    formulario_respondido = versao_1
                    created = False

            # Processa cada resposta
            for resposta in respostas_data:
                pergunta = get_object_or_404(Pergunta, id=resposta["pergunta"])

                Resposta.objects.update_or_create(
                    formulario_respondido=formulario_respondido,
                    pergunta=pergunta,
                    defaults={
                        "usuario": request.user,
                        "politica": str(resposta.get("politica", "")),
                        "pratica": str(resposta.get("pratica", "")),
                        "info_complementar": resposta.get("info_complementar", ""),
                        "anexos": resposta.get("anexos"),
                    },
                )

            return Response(
                {
                    "success": True,
                    "formulario_respondido_id": formulario_respondido.id,
                    "versao": formulario_respondido.versao,
                    "created": created,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# No arquivo views.py, adicione:
class FormulariosEmAndamentoView(generics.ListAPIView):
    serializer_class = FormularioRespondidoListSerializer

    def get_queryset(self):
        cliente_id = self.kwargs["cliente_id"]

        return (
            FormularioRespondido.objects.filter(cliente_id=cliente_id)
            .exclude(status="concluido")
            .order_by("-atualizado_em")
        )


class TodosFormulariosEmAnaliseView(APIView):
    def get(self, request):
        formularios_em_analise = FormularioRespondido.objects.filter(
            status="em_analise"
        ).select_related("cliente", "formulario")
        resultados = {}
        for form_respondido in formularios_em_analise:
            resultados[form_respondido.id] = {
                "id_cliente": form_respondido.cliente.id,
                "nome_cliente": form_respondido.cliente.nome,  # Ou outro campo de nome
                "id_formulario": form_respondido.formulario.id,
                "nome_formulario": form_respondido.formulario.nome,
            }
        return Response(resultados)


class FormularioPendenciaView(APIView):


    def post(self, request, form_id):

        formulario = get_object_or_404(FormularioRespondido, id=form_id)
        
        # Verifica se o usuário tem permissão (analista)
        # if not request.user.is_staff:
        #     return Response(
        #         {"error": "Apenas analistas podem colocar formulários em pendência"},
        #         status=status.HTTP_403_FORBIDDEN
        #     )
        
        observacoes = request.data.get('observacoes')
        if not observacoes:
            return Response(
                {"error": "O campo 'observacoes' é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Atualiza o status e as observações
        formulario.status = 'pendente'
        formulario.observacoes_pendencia = observacoes
        formulario.save()
        
        return Response(
            {
                "status": "Formulário colocado em pendência com sucesso",
                "formulario_id": formulario.id,
                "novo_status": formulario.status
            },
            status=status.HTTP_200_OK
        )
    

class TodosFormulariosRespondidosView(APIView):
    def get(self, request):
        try:
            # Busca todos os formulários respondidos
            formularios_respondidos = FormularioRespondido.objects.all()

            # Usa o serializer para formatar os dados
            serializer = FormularioRespondidoSerializer(formularios_respondidos, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)