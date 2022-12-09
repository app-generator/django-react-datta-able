from django.urls import path
from api.home import views

urlpatterns = [
   	path('ad-accounts', views.Add_Account.as_view(), name='ad-accounts'),
]
