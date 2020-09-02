from django.shortcuts import render
import os
import base64
from datetime import datetime

from decouple import config

import requests
from requests.auth import HTTPBasicAuth


def format_time():
    """
    returns formatted timestamp that safaricom accepts
    """
    unformatted_time = datetime.now()  # 2020-06-19 11:56:43.386871
    formatted_time = unformatted_time.strftime("%Y%m%d%H%M%S")  # 20200619115855
    return formatted_time


def generate_password(formatted_time):
    """
    """
    data_to_encode = (
        config("LIPA_NA_MPESA_SHORTCODE")
        + config("LIPA_NA_MPESA_PASSKEY")
        + formatted_time
    )

    # b'MTc0Mzc5IAliZmIyNzlmOWFhOWJkYmNmMTU4ZTk3ZGQ3MWE0NjdjZDJlMGM4OTMwNTliMTBmNzhlNmI3MmFkYTFlZDJjOTE5MjAyMDA2MTkxMjA1Mzk='
    encoded_string = base64.b64encode(data_to_encode.encode())

    # MTc0Mzc5IAliZmIyNzlmOWFhOWJkYmNmMTU4ZTk3ZGQ3MWE0NjdjZDJlMGM4OTMwNTliMTBmNzhlNmI3MmFkYTFlZDJjOTE5MjAyMDA2MTkxMjA1Mzk=
    decoded_password = encoded_string.decode("utf-8")

    return decoded_password


def generate_access_token():
    """
    """
    consumer_key = config("CONSUMER_KEY")
    consumer_secret = config("CONSUMER_SECRET")
    api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    r = requests.get(api_URL, auth=HTTPBasicAuth(consumer_key, consumer_secret))

    json_response = r.json()
    # {'access_token': 'lMT4Cy0PClNBU5D7DARmMGWJLoGF', 'expires_in': '3599'}

    mpesa_token = json_response["access_token"]

    return mpesa_token


def lipa_na_mpesa():
    access_token = generate_access_token()
    formatted_time = format_time()
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    headers = {"Authorization": "Bearer %s" % access_token}

    request = {
        "BusinessShortCode": config("LIPA_NA_MPESA_SHORTCODE"),
        "Password": generate_password(formatted_time),
        "Timestamp": formatted_time,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": "1",
        "PartyA": config("PHONE_NUMBER"),
        "PartyB": config("LIPA_NA_MPESA_SHORTCODE"),
        "PhoneNumber": config("PHONE_NUMBER"),
        "CallBackURL": "https://mpesa-maziwa.herokuapp.com/api/payments/lnm/",
        "AccountReference": "123456780",
        "TransactionDesc": "buymilk",
    }

    response = requests.post(api_url, json=request, headers=headers)

    print(response.json())


lipa_na_mpesa()
