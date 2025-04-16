# backend/api/views.py
from rest_framework import viewsets
from assessments.models import ControlAssessment, Question
from assessments.serializers import ControlAssessmentSerializer, QuestionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView


class ControlAssessmentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Lógica para retornar as avaliações
        assessments = [
            # Suas avaliações
        ]
        return Response(assessments)


class ControlAssessmentViewSet(viewsets.ModelViewSet):
    queryset = ControlAssessment.objects.all()
    serializer_class = ControlAssessmentSerializer

class QuestionList(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer