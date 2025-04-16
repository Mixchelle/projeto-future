# executive-report.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ControlAssessment

class ExecutiveReportView(APIView):
    def get(self, request, *args, **kwargs):
        # Busca todas as avaliações
        assessments = ControlAssessment.objects.all()

        # Calcula a média de maturidade
        total_score = sum(a.score for a in assessments)
        average_maturity = total_score / len(assessments) if assessments else 0

        # Identifica áreas de baixo desempenho (pontuação < 3)
        low_maturity_controls = [
            {
                "control_id": a.question.control_id,
                "average_maturity": a.score,
            }
            for a in assessments
            if a.score < 3
        ]

        # Sugestões de melhoria (exemplo)
        recommendations = [
            "Implementar automação para inventário de ativos.",
            "Melhorar o controle de acesso físico e lógico.",
            "Integrar inteligência artificial para detecção de anomalias.",
            "Revisar políticas de segurança periodicamente.",
        ]

        # Retorna o relatório
        report = {
            "averageMaturity": round(average_maturity, 2),
            "lowMaturityControls": low_maturity_controls,
            "recommendations": recommendations,
        }

        return Response(report, status=status.HTTP_200_OK)