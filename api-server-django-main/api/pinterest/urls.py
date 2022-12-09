# -*- encoding: utf-8 -*-

from django.urls import path
from api.pinterest import views

urlpatterns = [

    path('enable',views.enable,name='enable'),
	path('disable',views.disable,name='disable'),
	path('oauth',views.oauth,name='oauth'),
]
