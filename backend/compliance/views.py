from rest_framework import generics
from .models import Framework, Control
from assessments.serializers import FrameworkSerializer, ControlSerializer

class FrameworkList(generics.ListAPIView):
    queryset = Framework.objects.all()
    serializer_class = FrameworkSerializer

class ControlList(generics.ListAPIView):
    queryset = Control.objects.all()
    serializers_class = ControlSerializer