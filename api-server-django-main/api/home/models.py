from django.db import models
from ..user.models import User

# Create your models here.

class Authorizations(models.Model):
	user = models.ForeignKey(User, on_delete=models.RESTRICT)
	ad_platform = models.CharField(max_length=50)
	account_id = models.CharField(max_length=256,null=True)
	account_name = models.CharField(max_length=256,null=True)
	currency = models.CharField(max_length=64,null=True)
	country = models.CharField(max_length=64,null=True)
	permissions = models.CharField(max_length=256,null=True)
	refresh_token = models.CharField(max_length=256)
	refresh_token_expiry = models.DateTimeField(null=True)
	access_token = models.CharField(max_length=256)	
	access_token_expiry = models.DateTimeField(null=True)
	date_time = models.DateTimeField(null=True)
	ip_address = models.GenericIPAddressField(null=True)

	def __str__(self):
		return self.account_id
	