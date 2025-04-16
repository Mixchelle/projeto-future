from rest_framework import serializers
from .models import ControlAssessment, Answer, Question
from rest_framework import serializers
from assessments.models import RiskAssessment
from assessments.models import AssessmentResponse

class AssessmentResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResponse
        fields = ['id', 'user', 'question', 'politica', 'pratica', 'created_at']
        read_only_fields = ['user', 'created_at']

class RiskAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAssessment
        fields = '__all__'


class ControlAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlAssessment
        fields = ['id', 'title', 'status', 'score', 'category', 'date', 'question']
        ref_name = 'AssessmentsControlAssessment' # Nome da classe para Swagger

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
