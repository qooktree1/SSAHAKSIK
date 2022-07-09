from django.contrib import admin
from .models import Food, Date, Region, DailyFood, SideDish

admin.site.register(Food)
admin.site.register(Date)
admin.site.register(Region)
admin.site.register(DailyFood)
admin.site.register(SideDish)