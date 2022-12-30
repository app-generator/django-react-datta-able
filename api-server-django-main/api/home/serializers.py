from rest_framework import serializers
from .models import Authorizations

class AuthorizationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Authorizations
        fields = ["account_name","account_id","ad_platform_data"]