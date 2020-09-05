from rest_framework import serializers
from ..models import LNMOnlineTransaction


class LNMOnlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = LNMOnlineTransaction
        fields =['id']
