from django.urls import path
from .views import (LNMCallback)

urlpatterns = [
    path('lnm/', LNMCallback.as_view(), name="lnm-callback"),
]
