# control-assessments.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ControlAssessment
from core.serializers import ControlAssessmentSerializer

class ControlAssessmentListView(APIView):
    def get(self, request, *args, **kwargs):
        # Filtros opcionais (status, data de início, data de fim, categoria)
        status = request.query_params.get("status", None)
        date_from = request.query_params.get("date_from", None)
        date_to = request.query_params.get("date_to", None)
        category = request.query_params.get("category", None)

        # Query inicial
        assessments = ControlAssessment.objects.all()

        # Aplicar filtros
        if status:
            assessments = assessments.filter(status=status)
        if date_from:
            assessments = assessments.filter(created_at__gte=date_from)
        if date_to:
            assessments = assessments.filter(created_at__lte=date_to)
        if category:
            assessments = assessments.filter(category=category)

        # Serializar os dados
        serializer = ControlAssessmentSerializer(assessments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)