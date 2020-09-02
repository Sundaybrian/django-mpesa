from django.db import models
from django.utils import timezone

# Create your models here.
class LNMOnlineTransaction(models.Model):
    """
    model for lnm online
    """

    CheckoutRequestID = models.CharField(max_length=50, null=True, blank=True)
    MerchantRequestID = models.CharField(max_length=20, null=True, blank=True)
    ResultCode = models.IntegerField(default=0)
    ResultDesc = models.CharField(max_length=120, null=True, blank=True)
    Amount = models.FloatField(default=0)
    MpesaReceiptNumber = models.CharField(max_length=20, null=True, blank=True)
    TransactionDate = models.DateTimeField(default=timezone.now)
    PhoneNumber = models.CharField(max_length=15, null=True)

    def __str__(self):
        # return self.MpesaReceiptNumber
