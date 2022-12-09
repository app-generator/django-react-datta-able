from django.shortcuts import render,redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
import requests
import os, environ
import sys
from ..home.models import Authorizations
from .models import *
from datetime import datetime

from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.campaign import Campaign
from facebook_business.api import FacebookAdsApi

env = environ.Env(
	# set casting, default value
	DEBUG=(bool, True)
)

META_APP_ID = os.environ.get('META_APP_ID', None)
META_APP_SECRET = os.environ.get('META_APP_SECRET', None)
META_APP_TOKEN = os.environ.get('META_APP_TOKEN', None)
META_SYSTEM_USER_ACCESS_TOKEN = os.environ.get('META_SYSTEM_USER_ACCESS_TOKEN', None)

def enable(request):
	try:
		print('ENABLE META')
		Authorizations.objects.filter(user=request.user, ad_platform='meta_ads').delete()

		redirect_uri = 'https://' + env('SERVER', default='127.0.0.1') + '/meta/oauth/'
		authorization_url = 'https://www.facebook.com/v14.0/dialog/oauth?client_id=' + META_APP_ID + '&redirect_uri=' + redirect_uri + '&scope=ads_management,ads_management&state='

		return redirect(authorization_url)
	except Exception as e:
		print(e)
		exc_type, exc_obj, exc_tb = sys.exc_info()
		fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
		fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
		print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
		html_template = loader.get_template('home/page-500.html')
		context = {}
		return HttpResponse(html_template.render(context, request))


def disable(request):
	try:
		Authorizations.objects.filter(user=request.user, ad_platform='meta_ads').delete()
		return redirect('ad-accounts')
	except Exception as e:
		print(e)
		exc_type, exc_obj, exc_tb = sys.exc_info()
		fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
		fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
		print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
		html_template = loader.get_template('home/page-500.html')
		context = {}
		return HttpResponse(html_template.render(context, request))



def oauth(request):
	try:
		code = request.GET.get("code")
		code = str(code)

		# Get Access token
		redirect_uri = 'https://' + env('SERVER', default='127.0.0.1') + '/meta/oauth/'

		access_token_url = 'https://graph.facebook.com/v14.0/oauth/access_token?client_id=' + META_APP_ID + '&redirect_uri=' + redirect_uri + '&client_secret=' + META_APP_SECRET + '&code=' + code
	

		token_info = requests.get(access_token_url)
		token_info = token_info.json()
		access_token =token_info['access_token']

		authorization = Authorizations()
		authorization.user = request.user
		authorization.ad_platform = 'meta_ads'
		authorization.access_token = access_token
		authorization.save()

		debug_token_url = 'https://graph.facebook.com/v14.0/debug_token?input_token=' + access_token + '&access_token=' + META_APP_TOKEN
	 	
		print('meta oauth AAAA')
		print(debug_token_url)
		debug_token_info = requests.get(debug_token_url)
		debug_token_info = debug_token_info.json()
		print(debug_token_info)

		expires_at = debug_token_info['data']['expires_at']
		print(expires_at)

		fb_user_id = debug_token_info['data']['user_id']
		print(fb_user_id)
				
		print('ad_account_info a')
		account_info_url = 'https://graph.facebook.com/v14.0/' + str(fb_user_id) + '/assigned_ad_accounts?access_token=' + META_SYSTEM_USER_ACCESS_TOKEN
		ad_account_info = requests.get(account_info_url)
		ad_account_info = ad_account_info.json()
		print(ad_account_info)

		print('ad_account_info b')
		account_info_url = url =  "https://graph.facebook.com/v14.0/me/adaccounts?fields=name,account_id,currency,timezone_id&access_token="+access_token

		print('ad_account_info c')
		ad_account_info = requests.get(account_info_url)
		print('ad_account_info d')
		ad_account_info = ad_account_info.json()
		print('ad_account_info e')
		print(ad_account_info)

		account_ids = ad_account_info['data']
		print('ad_account_info f')

		if len(account_ids)==1:
			print('ad_account_info g')
				
			account_id=account_ids[0]['id']
			account_name=account_ids[0]['name']
			authorization.account_id=account_id
			authorization.account_name=account_name
			authorization.date_time=datetime.utcnow()
			authorization.save()
			
			return redirect('/ad-accounts')
		else:
			
			print('ad_account_info h')
			accounts=[]
			for i in account_ids:
				print('ad_account_info i')
				account = {}
				account['account_id'] = i['account_id']
				account['account_name'] = i['name']
				accounts.append(account)
				print('ad_account_info g')
			print('ad_account_info h')
			return render(request,'home/choose_account.html',{'accounts':accounts, 'ad_platform':'meta_ads'})

	except Exception as e:
		print(e)
		exc_type, exc_obj, exc_tb = sys.exc_info()
		fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
		fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
		print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
		html_template = loader.get_template('home/page-500.html')
		context = {}
		return HttpResponse(html_template.render(context, request))


