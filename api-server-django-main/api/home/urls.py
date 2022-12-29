from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api.home import views

urlpatterns = [
    path('ad-accounts/', views.Add_Account.as_view(), name='ad-accounts'),
    path('ad-accounts/<int:pk>/',
         views.Add_Account.as_view(), name='ad-accounts'),
]
