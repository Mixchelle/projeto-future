from django.urls import path, include
from rest_framework.routers import DefaultRouter
from assessments.views import QuestionViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')

urlpatterns = [
    path('', include(router.urls)),
    path('questions/by_category/', 
         QuestionViewSet.as_view({'get': 'by_category'}), 
         name='questions-by-category'),
]