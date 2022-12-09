from django.urls import path
from api.google_ads import views

urlpatterns = [
	path('ad-campaign-create',views.ad_campaign_create,name='ad-campaign-create'),
	path('enable',views.EnableAPI.as_view(),name='enable'),
	path('disable', views.DisableAPI.as_view(), name='disable'),
	path('oauth',views.OauthAPI.as_view(),name='oauth'),
]
