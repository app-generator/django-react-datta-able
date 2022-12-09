from django.shortcuts import render,redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
import requests
import os, environ
import sys
from ..home.models import Authorizations

from datetime import datetime, timedelta

import base64
import urllib.parse

import ast
import json

env = environ.Env(
	# set casting, default value
	DEBUG=(bool, True)
)

PINTEREST_APP_ID = os.environ.get('PINTEREST_APP_ID', None)
PINTEREST_APP_SECRET = os.environ.get('PINTEREST_APP_SECRET', None)

def enable(request):
	try:
		Authorizations.objects.filter(user=request.user, ad_platform='pinterest').delete()
		redirect_uri = 'https://' + env('SERVER', default='127.0.0.1') + '/pinterest/oauth'
		authorization_url = 'https://www.pinterest.com/oauth/?client_id=' + PINTEREST_APP_ID  + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=ads:read,ads:write&grant_typeauthorization_code'
		
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
		Authorizations.objects.filter(user=request.user, ad_platform='pinterest').delete()
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
		auth_code = request.GET.get("code")
		auth_code = str(auth_code)
		# Get Access token
		access_token_url = 'https://api.pinterest.com/v5/oauth/token?'
		redirect_uri = 'https://' + env('SERVER', default='127.0.0.1') + '/pinterest/oauth'
		
		print(auth_code)
		print(redirect_uri)
		payload = {
			'grant_type' : 'authorization_code',
			'code' : auth_code,
			'redirect_uri' : redirect_uri,
		}
		urllib.parse.urlencode(payload)

		print(payload)
	
		base64_auth = str(PINTEREST_APP_ID) + ':' + str(PINTEREST_APP_SECRET)
		base64_auth = base64_auth.encode('ascii')
		base64_auth = base64.b64encode(base64_auth)
		base64_auth = base64_auth.decode('ascii')

		headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
		"Authorization" : "Basic " + base64_auth,
    	}

		response = requests.post(url=access_token_url, headers=headers, data=payload)
		token_info  = response.json()

		print(token_info)

		access_token = token_info['access_token']
		expires_in  = token_info['expires_in']
		access_token_expiry = datetime.utcnow() + timedelta(seconds=expires_in) 
		refresh_token = token_info['refresh_token']
		refresh_token_expires_in  = token_info['refresh_token_expires_in']
		refresh_token_expiry = datetime.utcnow() + timedelta(seconds=refresh_token_expires_in) 
		
	
		ad_accounts_url = 'https://api.pinterest.com/v5/ad_accounts/'
	
		bearer_token = "Bearer " + str(access_token)
		
		headers = {
			"Authorization": bearer_token,
		}

		response = requests.get(url=ad_accounts_url, headers=headers)
		account_details  = response.json()
		print(account_details)

		ad_accounts = account_details['items']

		authorization = Authorizations()
		authorization.user = request.user
		authorization.ad_platform = 'pinterest'
		authorization.access_token = access_token
		authorization.access_token_expiry = refresh_token_expiry
		authorization.refresh_token = access_token
		authorization.refresh_token_expiry = refresh_token_expiry
		authorization.save()

		if len(ad_accounts)==1:
			account_id=ad_accounts[0]['id']
			account_name=ad_accounts[0]['name']
			account_currency=ad_accounts[0]['currency']
			account_country=ad_accounts[0]['country']
			account_permissions=ad_accounts[0]['permissions']
			authorization.account_id=account_id
			authorization.account_name=account_name
			authorization.currency=account_currency
			authorization.country=account_country
			authorization.permissions=account_permissions
			authorization.date_time=datetime.utcnow()
			
			authorization.save()
			
			return redirect('/ad-accounts')
		else:
			accounts=[]
			for i in ad_accounts:
				account = {}
				account['account_id'] = i['id']
				account['account_name'] = i['name']
				accounts.append(account)

			return render(request,'home/choose_account.html',{'accounts':accounts, 'ad_platform':'pinterest'})

	except Exception as e:
		print(e)
		exc_type, exc_obj, exc_tb = sys.exc_info()
		fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
		fpath = os.path.split(exc_tb.tb_frame.f_code.co_filename)[0]
		print('ERROR', exc_type, fpath, fname, 'on line', exc_tb.tb_lineno)
		html_template = loader.get_template('home/page-500.html')
		context = {}
		return HttpResponse(html_template.render(context, request))


