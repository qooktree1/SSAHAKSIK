from django.db import models
from django.conf import settings

# Create your models here.

class SideDish(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Food(models.Model):
    name = models.CharField(max_length=100, unique=True)
    food_img = models.ImageField(upload_to='food-images/', default='default.png')

    def __str__(self):
        return self.name


class Region(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Date(models.Model):
    date = models.DateField(unique=True)

    def __str__(self):
        return str(self.date)
# 날짜 넣는 방법
# http://oniondev.egloos.com/9860231
# https://docs.djangoproject.com/el/3.2/ref/forms/fields/#datetimefield


class DailyFood(models.Model):
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    date = models.ForeignKey(Date, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    side_dish = models.ManyToManyField(SideDish, related_name='daily_foods')

    def __str__(self):
        return str(self.date) + ' ' + str(self.region) + ' ' + str(self.food)



