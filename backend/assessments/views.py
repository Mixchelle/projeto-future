from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models import Avg
from .models import ControlAssessment, RiskAssessment, Question, AssessmentResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import (
    ControlAssessmentSerializer,
    RiskAssessmentSerializer,
    QuestionSerializer,
    AssessmentResponseSerializer
)
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.http import JsonResponse
from django.views import View

@method_decorator(csrf_exempt, name='dispatch')
class SubmitReportView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        # Lógica para processar o envio do relatório
        return JsonResponse({'message': 'Relatório enviado com sucesso!'})

class ReportViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def lgpd_score(self, request):
        """Calcula o score de conformidade com LGPD baseado nas respostas do usuário"""
        try:
            user_responses = AssessmentResponse.objects.filter(user=request.user)
            
            if not user_responses.exists():
                return Response(
                    {"error": "Nenhuma resposta encontrada para este usuário"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            categories = ['GV', 'ID', 'PR', 'DE', 'RS', 'RC']
            scores = {}
            
            for category in categories:
                cat_responses = user_responses.filter(question__category__startswith=category)
                
                if cat_responses.exists():
                    avg_policy = cat_responses.aggregate(avg=Avg('politica'))['avg']
                    avg_practice = cat_responses.aggregate(avg=Avg('pratica'))['avg']
                    
                    scores[category] = {
                        'politica': round(avg_policy, 2),
                        'pratica': round(avg_practice, 2),
                        'total': round((avg_policy + avg_practice) / 2, 2),
                        'count': cat_responses.count()
                    }

            if not scores:
                return Response(
                    {"error": "Não foi possível calcular scores para nenhuma categoria"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            lgpd_score = sum(v['total'] for v in scores.values()) / len(scores)
            is_compliant = lgpd_score >= 3.5  # Threshold ajustável
            
            return Response({
                'scores': scores,
                'lgpd_score': round(lgpd_score, 2),
                'is_compliant': is_compliant,
                'recommendations': self.get_recommendations(scores),
                'generated_at': datetime.now().isoformat(),
                'user': request.user.username
            })
            
        except Exception as e:
            return Response(
                {"error": f"Erro ao calcular score: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_recommendations(self, scores):
        """Gera recomendações personalizadas baseadas nos scores"""
        recommendations = []
        improvement_areas = {
            'GV': "Governança de dados e políticas de privacidade",
            'ID': "Identificação e mapeamento de dados pessoais",
            'PR': "Proteção e segurança dos dados",
            'DE': "Detecção de violações e incidentes",
            'RS': "Resposta a incidentes e notificações",
            'RC': "Recuperação e lições aprendidas"
        }
        
        for category, score in scores.items():
            if score['total'] < 3:
                rec = {
                    'category': category,
                    'name': improvement_areas.get(category, category),
                    'current_score': score['total'],
                    'action': f"Melhorar processos de {improvement_areas.get(category, category)}",
                    'priority': "Alta" if score['total'] < 2 else "Média"
                }
                recommendations.append(rec)
        
        if not recommendations:
            recommendations.append({
                'message': "Sua organização está em conformidade com as principais exigências da LGPD",
                'suggestion': "Considere realizar auditorias periódicas para manter a conformidade"
            })
        
        return recommendations

class AssessmentResponseViewSet(viewsets.ModelViewSet):
    serializer_class = AssessmentResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retorna apenas as respostas do usuário atual"""
        return AssessmentResponse.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associa automaticamente o usuário logado à resposta"""
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Cria múltiplas respostas em um único request"""
        try:
            if isinstance(request.data, list):
                # Validação em lote
                serializer = self.get_serializer(data=request.data, many=True)
                serializer.is_valid(raise_exception=True)
                
                # Verifica duplicatas antes de criar
                question_ids = [item['question'] for item in request.data]
                existing = AssessmentResponse.objects.filter(
                    user=request.user,
                    question__in=question_ids
                ).values_list('question', flat=True)
                
                if existing:
                    return Response(
                        {"error": f"Respostas já existem para as questões: {list(existing)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
            
            return super().create(request, *args, **kwargs)
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ControlAssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = ControlAssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtra avaliações pelo usuário atual"""
        return ControlAssessment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associa o usuário logado e calcula o score"""
        instance = serializer.save(user=self.request.user)
        instance.calculate_score()
        instance.save()

class RiskAssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = RiskAssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtra avaliações de risco pelo usuário atual"""
        return RiskAssessment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associa o usuário logado automaticamente"""
        serializer.save(user=self.request.user)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('category', 'id')
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Retorna questões agrupadas por categoria"""
        categories = Question.objects.values_list('category', flat=True).distinct()
        result = {}
        
        for category in categories:
            questions = self.get_queryset().filter(category=category)
            serializer = self.get_serializer(questions, many=True)
            result[category] = serializer.data
        
        return Response(result)

class ExecutiveReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Gera um relatório executivo consolidado"""
        try:
            # Obter dados do ReportViewSet
            report_view = ReportViewSet()
            report_view.request = request
            report_view.format_kwarg = None
            lgpd_data = report_view.lgpd_score(request).data
            
            # Adicionar métricas adicionais
            response_count = AssessmentResponse.objects.filter(user=request.user).count()
            question_count = Question.objects.count()
            completion_percentage = (response_count / question_count) * 100 if question_count > 0 else 0
            
            data = {
                'lgpd_assessment': lgpd_data,
                'metrics': {
                    'questions_answered': response_count,
                    'total_questions': question_count,
                    'completion_percentage': round(completion_percentage, 2),
                    'last_updated': datetime.now().isoformat()
                },
                'recommendations': lgpd_data.get('recommendations', [])
            }
            
            return Response(data)
            
        except Exception as e:
            return Response(
                {"error": f"Erro ao gerar relatório: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SaveAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Endpoint para salvar uma avaliação completa"""
        try:
            # Verifica se todas as questões foram respondidas
            total_questions = Question.objects.count()
            user_responses = AssessmentResponse.objects.filter(user=request.user).count()
            
            if user_responses < total_questions:
                missing = total_questions - user_responses
                return Response(
                    {"error": f"Faltam responder {missing} questões para completar a avaliação"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Aqui você pode adicionar lógica para gerar um PDF ou salvar um relatório final
            return Response({
                "message": "Avaliação salva com sucesso",
                "details": {
                    "total_questions": total_questions,
                    "answered_questions": user_responses,
                    "saved_at": datetime.now().isoformat()
                }
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def get_category_name(code):
    """Helper function para traduzir códigos de categoria"""
    names = {
        "GV": "Governança",
        "ID": "Identificar",
        "PR": "Proteger",
        "DE": "Detectar",
        "RS": "Responder",
        "RC": "Recuperar"
    }
    return names.get(code, code)