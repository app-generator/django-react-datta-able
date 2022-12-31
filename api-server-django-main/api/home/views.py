from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import AuthorizationSerializers
from datetime import datetime


from .models import *


class Add_Account(APIView):
    def post(self, request):

        account = request.data.get("account_id")
        ad_platform = request.data.get("ad_platform")
        current_user = request.user

        authorization = Authorizations.objects.filter(user=current_user, account_id=None, ad_platform=ad_platform).update(
            account_id=account, account_name=account, date_time=datetime.utcnow(), )

        authorized_platforms_list = list(Authorizations.objects.filter(
            user=current_user).exclude(account_id__isnull=True).all())
        context = {}
        authorized_platforms = {}
        for i in authorized_platforms_list:
            authorized_platforms[i.ad_platform] = i.account_name

            context['authorized_platforms'] = authorized_platforms
            context['segment'] = 'ad-accounts'
            context['title'] = 'Connected ad accounts'

        return Response({"message": 'success', 'account_id': account})
    
    def get(self,request,format=None):
        account_ads = Authorizations.objects.filter(user=request.user)
        if account_ads:
            serializer = AuthorizationSerializers(account_ads,many=True)
            return Response({"message": 'success', 'accounts': serializer.data,"ads":True})
        else:
            return Response({"message": 'false',"ads":False})
