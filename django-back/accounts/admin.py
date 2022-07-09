from django.contrib import admin
from .models import User, FoodLikeStatus

admin.site.register(FoodLikeStatus)
admin.site.register(User)