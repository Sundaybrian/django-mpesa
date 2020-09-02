from django.db import models
from time import timezone

# Create your models here.
class LNMOnlineTransaction(models.Model):
    """
    model for lnm online
    """

    CheckoutRequestID = models.CharField(max_length=50, null=False)
    MerchantRequestID = models.CharField(max_length=20, null=False)
    ResultCode = models.IntegerField()
    ResultDesc = models.CharField(max_length=120)
    Amount = models.FloatField(default=0)
    MpesaReceiptNumber = models.CharField(max_length=20)
    TransactionDate = models.DateTimeField(default=timezone.now)
    PhoneNumber = models.CharField(max_length=15)

    def __str__(self):
        return self.MpesaReceiptNumber
