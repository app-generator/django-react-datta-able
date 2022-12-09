from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template import loader
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import os
import environ
import sys
from ..home.models import Authorizations
from google.ads.googleads.client import GoogleAdsClient
import google_auth_oauthlib.flow
from .models import *


from datetime import datetime

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, True)
)

# Create your views here.
CLIENT_CONFIG = {'web': {
    'client_id': os.environ.get('GOOGLE_CLIENT_ID', None),
    'client_id': os.environ.get('GOOGLE_CLIENT_ID', None),
    'project_id': os.environ.get('GOOGLE_PROJECT_ID', None),
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://www.googleapis.com/oauth2/v3/token',
    'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
    'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET', None),
    'redirect_uris': "http://127.0.0.1:8000/api/google_ads/oauth",
    'javascript_origins': os.environ.get('GOOGLE_JAVASCRIPT_ORIGINS', None), }}

print(CLIENT_CONFIG)
# This scope will allow the application to manage ad words accounts
SCOPES = ['https://www.googleapis.com/auth/adwords']
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'


def account_list(request):
    try:
        client = call_client(request)
        customer_service = client.get_service("CustomerService")
        accessible_customers = customer_service.list_accessible_customers()
        result_total = len(accessible_customers.resource_names)
        resource_names = accessible_customers.resource_names
        return resource_names
    except Exception as e:
        print(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
        print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
        html_template = loader.get_template('home/page-500.html')
        context = {}
        return HttpResponse(html_template.render(context, request))


def ad_campaign_create(request):
    try:
        print('ad campaign create')
        customer_id = request.POST.get('customer_id')
        budget_name = request.POST.get('budget')
        budget_amount = int(request.POST.get('daily_budget'))*1000000
        campaign_name = request.POST.get('campaign_name')
        channel_type = request.POST.get('channeltype')
        if channel_type == None:
            channel_type = 'unspecified'
        start_time = request.POST.get('campaign_start_date')
        start_time = datetime.strptime(start_time, "%m/%d/%Y")
        start_time = start_time.strftime('%Y-%m-%d')
        end_time = request.POST.get('campaign_end_date')
        end_time = datetime.strptime(end_time, "%m/%d/%Y")
        end_time = end_time.strftime('%Y-%m-%d')
        age_range = request.POST.getlist('age_range')
        print(customer_id)
        client = call_client(request)
        print('called')
        campaign_service = client.get_service("CampaignService")

        # CREATING BUDGET
        campaign_budget_service = client.get_service("CampaignBudgetService")
        campaign_budget_operation = client.get_type("CampaignBudgetOperation")
        campaign_budget = campaign_budget_operation.create
        campaign_budget.name = budget_name
        campaign_budget.amount_micros = budget_amount
        campaign_budget.delivery_method = (
            client.enums.BudgetDeliveryMethodEnum.STANDARD
        )
        campaign_budget_response = (
            campaign_budget_service.mutate_campaign_budgets(
                customer_id=customer_id, operations=[campaign_budget_operation]
            ))

        # Create campaign.

        campaign_operation = client.get_type("CampaignOperation")
        campaign = campaign_operation.create
        campaign.name = campaign_name
        campaign.status = client.enums.CampaignStatusEnum.PAUSED
        campaign.manual_cpc.enhanced_cpc_enabled = True
        campaign.campaign_budget = campaign_budget_response.results[0].resource_name
        campaign.start_date = start_time
        campaign.end_date = end_time
        campaign.advertising_channel_type = (
            client.enums.AdvertisingChannelTypeEnum.SEARCH
        )
        campaign_response = campaign_service.mutate_campaigns(
            customer_id=customer_id, operations=[campaign_operation]

        )
        campaign = campaign_response.results[0].resource_name
        # ADDING CRITERIONS TO CAMPAIGN
        campaign_criterion_service = client.get_service(
            "CampaignCriterionService")
        criterions = []
        if age_range:
            for i in age_range:
                criterions.append(age_range_criterion(
                    client, i, campaign_response.results[0].resource_name, 'campaign'))
        if criterions:
            campaign_criterion_response = (
                campaign_criterion_service.mutate_campaign_criteria(
                    customer_id=customer_id, operations=criterions
                )
            )
        return JsonResponse({'message': 'campaign created successfully'})

    except Exception as e:
        print(e)
        return JsonResponse({'message': 'an error occured'})


def age_range_criterion(client, agerange, resourcename, forwhat):
    try:
        if forwhat == 'adgroup':
            criterion_operation = client.get_type("AdGroupCriterionOperation")
            age_range = criterion_operation.create
            age_range.ad_group = resourcename
        elif forwhat == 'campaign':
            criterion_operation = client.get_type("CampaignCriterionOperation")
            age_range = criterion_operation.create
            age_range.campaign = resourcename
            age_range.negative = True
        if agerange == 'range1':
            age_range.age_range.type_ = (
                client.enums.AgeRangeTypeEnum.AGE_RANGE_18_24
            )
        elif agerange == 'range2':
            age_range.age_range.type_ = (
                client.enums.AgeRangeTypeEnum.AGE_RANGE_25_34
            )
        elif agerange == 'range3':
            age_range.age_range.type_ = (
                client.enums.AgeRangeTypeEnum.AGE_RANGE_35_44
            )
        elif agerange == 'range4':
            age_range.age_range.type_ = (
                client.enums.AgeRangeTypeEnum.AGE_RANGE_45_54
            )
        return criterion_operation
    except Exception as e:
        print(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
        print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
        html_template = loader.get_template('home/page-500.html')
        context = {}
        return HttpResponse(html_template.render(context, request))


def call_client(request):

    print(os.environ.get("GOOGLE_DEVELOPER_TOKEN", None))
    try:
        if 'credentials' in request.session:
            credentials = request.session['credentials']
        else:
            credentials = {'developer_token':  os.environ.get(
                "GOOGLE_DEVELOPER_TOKEN", None), 'use_proto_plus': True}
        user = Authorizations.objects.get(
            user=request.user, ad_platform='google_ads')
        if user.refresh_token:
            credentials['refresh_token'] = user.refresh_token
        if user.account_id:
            credentials['login_customer_id'] = user.account_id

        client = GoogleAdsClient.load_from_dict(credentials, version="v11")
        return client
    except Exception as e:
        print(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
        print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
        html_template = loader.get_template('home/page-500.html')
        context = {}
        return HttpResponse(html_template.render(context, request))


def credentials_to_dict(credentials):
    try:
        cr = {'developer_token':  os.environ.get("GOOGLE_DEVELOPER_TOKEN", None),
              'use_proto_plus': True,
              'refresh_token': credentials.refresh_token,
              'client_id': credentials.client_id,
              'client_secret': credentials.client_secret,
              # 'login_customer_id':account_id.replace(' ',''),
              'token_uri': credentials.token_uri
              }
        return cr
    except Exception as e:
        print(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
        print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
        html_template = loader.get_template('home/page-500.html')
        context = {}
        return HttpResponse(html_template.render(context, request))


def customer_accounts(request):
    try:
        client = call_client(request)
        account_id = request.session['credentials']['login_customer_id']
        googleads_service = client.get_service("GoogleAdsService")
        query = """
		SELECT
		customer_client.descriptive_name,
		customer_client.id
		FROM customer_client
		WHERE customer_client.level <= 1"""

        customer_id = account_id
        response = googleads_service.search(
            customer_id=str(customer_id), query=query
        )
        client_ids = []
        for i in response:
            if str(i.customer_client.id) != account_id:
                client_ids.append(i)

        return client_ids
    except Exception as e:
        print(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
        print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)

class DisableAPI(APIView):
    def delete(self,request):
        Authorizations.objects.filter(
            user=request.user, ad_platform='google_ads').delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class EnableAPI(APIView):
    def get(self, request):
        Authorizations.objects.filter(
            user=request.user, ad_platform='google_ads').delete()

        flow = google_auth_oauthlib.flow.Flow.from_client_config(
            client_config=CLIENT_CONFIG,
            scopes=SCOPES)
        flow.redirect_uri = 'http://localhost:3000/app/ads-enable/accounts'
        authorization_url, state = flow.authorization_url(
            prompt='consent', include_granted_scopes='true')
        return Response({"authorization_url": authorization_url})


class OauthAPI(APIView):
    def post(self, request):
        state = request.data.get('state')
        code = request.data.get("code")
        code = str(code)
        flow = google_auth_oauthlib.flow.Flow.from_client_config(
            client_config=CLIENT_CONFIG,
            scopes=SCOPES, state=state, redirect_uri='http://localhost:3000/app/ads-enable/accounts')
        flow.fetch_token(code=code)
        credentials = flow.credentials
        refresh_token = credentials.refresh_token
        token = credentials.token
        authorization = Authorizations()
        authorization.user = request.user
        authorization.ad_platform = 'google_ads'
        authorization.access_token = token
        refresh_token = refresh_token
        authorization.save()
        request.session['credentials'] = credentials_to_dict(credentials)
        account_ids = account_list(request)

        if len(account_ids) == 1:

            account_id = account_ids[0][10:]
            account_name = account_ids[0][10:]
            authorization.account_id = account_id
            authorization.account_name = account_name
            authorization.date_time = datetime.utcnow()
            authorization.ip_address = "192.168.0.9"
            authorization.save()
            request.session['account_id'] = account_id
            return Response({'accounts': account_id, 'ad_platform': 'google_ads'})

        else:
            accounts = []
            print('ACCOUNT IDS')
            print(account_ids)

            for i in account_ids:

                account = {}
                account['account_id'] = i[10:]
                account['account_name'] = i[10:]
                accounts.append(account)

            print(accounts)
            print('ACCOUNTS!!!')
            return Response({'accounts': accounts, 'ad_platform': 'google_ads'})
