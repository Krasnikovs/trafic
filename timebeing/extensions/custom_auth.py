#!/usr/bin/python3

################################################################
# @Bevywise.com IOT Initiative. All rights reserved 
# www.bevywise.com Email - support@bevywise.com
#
# custom_auth.py
# 
# The Custom auth hook can be enabled in the broker.conf 
# inside conf/ folder.
# 
# The parameter data will be in dict format and the keys are 'sender','username', 'password', 'clientid', 'ipaddress'
#
################################################################
import requests

# Request Retries Count 
requests.adapters.DEFAULT_RETRIES = 3

# Request URL
url = "https://www.bevywise.com/Auth"

# Request Timeout 
request_timeout = 0.1

# Request Method
request_auth_method = "POST"
# POST | GET | PUT

def handle_Device_Auth(username,password,clientid,ipaddress):
	try:
		payload = {'username':username,'password': password,'clientid': clientid,'ipaddress': ipaddress}		
		print('Remote Authentication API called with payload:{}'.format(payload))
		headers = {
		   	'Content-Type': "application/x-www-form-urlencoded",
		    }
		response = requests.request(request_auth_method,url,data=payload,headers=headers,timeout=request_timeout)
		if response.status_code == 200:
			print("Authentication Success for clientid:{} wih response code:{}".format(clientid, response.status_code))
			return True
		else:
			print("Authentication failed for clientid:{} wih error code:{}".format(clientid, response.status_code))
			return False
	except Exception as e:
		print("Unable to connect to URL:{}".format(url))
		return False
	