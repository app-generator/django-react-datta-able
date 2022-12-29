from django.urls import path, include


urlpatterns = [
    path("api/users/", include(("api.routers", "api"), namespace="api")),
    path("api/google_ads/", include("api.google_ads.urls")),
    path("api/pinterest_ads/", include("api.pinterest.urls")),
    path("api/meta_ads/", include("api.meta.urls")),
    path("api/home/", include("api.home.urls")),
]
