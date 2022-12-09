from django.urls import path, include


urlpatterns = [
    path("api/users/", include(("api.routers", "api"), namespace="api")),
    path("api/google_ads/", include("api.google_ads.urls")),
    path("api/pinterest/", include("api.pinterest.urls")),
    path("api/meta/", include("api.meta.urls")),
    path("api/home/", include("api.home.urls")),
]
