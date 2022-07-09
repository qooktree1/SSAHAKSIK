from django.db import models
from django.conf import settings
from foods.models import Food, Region


class Review(models.Model):
    # title = models.CharField(max_length=150)
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    review_img = models.ImageField(null=True, blank=True, upload_to='review-images/')
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_reviews', blank=True)

    def __str__(self):
        return self.review