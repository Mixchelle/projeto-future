from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from form.models import FormularioRespondido
from .serializers import MaturityAssessmentSerializer
from .services import calculate_maturity


class MaturityAssessmentView(APIView):
    def get(self, request, formulario_respondido_id):
        try:
            formulario_respondido = FormularioRespondido.objects.get(
                id=formulario_respondido_id
            )
        except FormularioRespondido.DoesNotExist:
            return Response(
                {"error": "Formulário respondido não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Calcula a maturidade (isso criará ou atualizará a avaliação)
        maturity_assessment = calculate_maturity(formulario_respondido.id)

        if hasattr(maturity_assessment, "error"):
            return Response(
                {"error": maturity_assessment.error}, status=status.HTTP_400_BAD_REQUEST
            )

        # Serializa os dados completos
        serializer = MaturityAssessmentSerializer(
            maturity_assessment, context={"request": request}
        )

        return Response(serializer.data)
