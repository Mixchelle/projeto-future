from django.contrib.auth.decorators import permission_required
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import render
import logging
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from rest_framework import viewsets, status
from core.models import ControlAssessment, Standard
from core.serializers import ControlAssessmentSerializer, StandardSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ValidateTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Token válido!"}, status=200)


# Visão de Conformidade (Normas de conformidade)
class ComplianceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        standards = Standard.objects.all()
        serializer = StandardSerializer(standards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Visão de Informações do Usuário
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })


# ControlAssessment com Ação para Filtragem
class ControlAssessmentViewSet(viewsets.ModelViewSet):
    queryset = ControlAssessment.objects.all()
    serializer_class = ControlAssessmentSerializer

    @action(detail=False, methods=['get'])
    def filter_assessments(self, request):
        status = request.query_params.get('status', None)
        date_from = request.query_params.get('date_from', None)
        date_to = request.query_params.get('date_to', None)

        assessments = ControlAssessment.objects.all()

        if status:
            assessments = assessments.filter(status=status)
        if date_from:
            assessments = assessments.filter(date__gte=date_from)
        if date_to:
            assessments = assessments.filter(date__lte=date_to)

        serializer = ControlAssessmentSerializer(assessments, many=True)
        return Response(serializer.data)

    permission_classes = [IsAuthenticated]


# Visões Públicas
def public_view(request):
    data = {
        'message': 'This is a public endpoint.'
    }
    return JsonResponse(data)


# Visão Protegida, acessível somente para usuários autenticados
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "Você está autenticado!"})


# Lógica para Criar Relatórios (Unificando as funções)
logger = logging.getLogger(__name__)

@permission_required('users.add_report', raise_exception=True)
def create_report(request):
    try:
        # Sua lógica para criar o relatório
        logger.info(f"Relatório criado por {request.user.username}")
        return render(request, 'template.html')  # Substitua 'template.html' pelo template real
    except Exception as e:
        logger.error(f"Erro ao criar o relatório: {str(e)}")
        raise PermissionDenied("Você não tem permissão para acessar esta página.")


# Exemplo de outra view com verificação de permissões
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@permission_required('core.view_avaliacao', raise_exception=True)
def get_avaliacoes(request):
    return Response({"message": "Acesso autorizado para avaliações"})
