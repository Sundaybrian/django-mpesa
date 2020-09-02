from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView

from lipa_na_mpesa.models import LNMOnlineTransaction
from .serializers import LNMOnlineSerializer

# from ..lnm import lipa_na_mpesa


class LNMCallback(CreateAPIView):
    queryset = LNMOnlineTransaction.objects.all()
    serializer_class = LNMOnlineSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        """
        {
            "Body":{
                "stkCallback":{
                    "MerchantRequestID":"11115-96123919-1",
                    "CheckoutRequestID":"ws_CO_020920201849066471",
                    "ResultCode":0,
                    "ResultDesc":"The service request is processed successfully.",
                    "CallbackMetadata":{
                        "Item":[
                        {
                            "Name":"Amount",
                            "Value":1.0
                        },
                        {
                            "Name":"MpesaReceiptNumber",
                            "Value":"OI226RAA36"
                        },
                        {
                            "Name":"Balance"
                        },
                        {
                            "Name":"TransactionDate",
                            "Value":20200902184914
                        },
                        {
                            "Name":"PhoneNumber",
                            "Value":254714382366
                        }
                        ]
                    }
                }
            }
        }
        """
        merchant_request_id = request.data["Body"]["stkCallback"]["MerchantRequestID"]
        checkout_request_id = request.data["Body"]["stkCallback"]["CheckoutRequestID"]
        result_code = request.data["Body"]["stkCallback"]["ResultCode"]
        result_desc = request.data["Body"]["stkCallback"]["ResultDesc"]
        amount = request.data["Body"]["stkCallback"]["CallbackMetaData"]["Item"][0][
            "Value"
        ]
        mpesa_receipt_number = ["stkCallback"]["CallbackMetaData"]["Item"][1]["Value"]
        transaction_date = request.data["Body"]["stkCallback"]["CallbackMetaData"][
            "Item"
        ][3]["Value"]
        phone_number = request.data["Body"]["stkCallback"]["CallbackMetaData"]["Item"][
            4
        ]["Value"]

        from datetime import datetime

        str_transaction_date = str(transaction_date)
        transaction_datetime = datetime.strptime(str_transaction_date, "%Y%m%d%H%M%S")

        transaction = LNMOnlineTransaction.objects.create(
            CheckoutRequestID=checkout_request_id,
            MerchantRequestID=merchant_request_id,
            ResultCode=result_code,
            ResultDesc=result_desc,
            Amount=amount,
            MpesaReceiptNumber=mpesa_receipt_number,
            TransactionDate=transaction_datetime,
            PhoneNumber=phone_number,
        )

        transaction.save()
        print(request.data)

        return Response(serializers.data, status=status.HTTP_201_CREATED)

