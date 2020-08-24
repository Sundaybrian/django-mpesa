from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView

from lipa_na_mpesa.models import LNMOnlineTransaction
from .serializers import LNMOnlineSerializer
from ..lnm import lipa_na_mpesa


class LNMCallback(CreateAPIView):
    queryset=LNMOnlineTransaction.objects.all()
    serializer_class=LNMOnlineSerializer
    permission_classes =[AllowAny]

    def create(self, request):
        print(request.data)

