from rest_framework import serializers
from .models import User, Assessment, Report, Compliance, ControlAssessment, Standard

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ControlAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlAssessment
        fields = '__all__'  # Ou liste os campos que deseja serializar
        ref_name = 'Core_ControlAssessment'

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class ComplianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compliance
        fields = '__all__'

class StandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Standard
        fields = ['id', 'name', 'description']
