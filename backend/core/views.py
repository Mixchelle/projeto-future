from rest_framework import viewsets
from .models import User, Assessment, Report, Compliance
from .serializers import UserSerializer, AssessmentSerializer, ReportSerializer, ComplianceSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

class ComplianceViewSet(viewsets.ModelViewSet):
    queryset = Compliance.objects.all()
    serializer_class = ComplianceSerializer
