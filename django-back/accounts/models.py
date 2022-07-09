from django.db import models
from django.contrib.auth.models import AbstractUser
from foods.models import Food, Region

class User(AbstractUser):
    # haknumber = models.IntegerField(blank=True, null=True, unique=True)  # 사용 안 할 예정이지만 일단 나둠
    region = models.ForeignKey(Region, on_delete=models.CASCADE, default=1)  # 필수 값으로 변경
    first_name= models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=254, unique=True)
    food_like_status = models.ManyToManyField(
        Food,
        through="FoodLikeStatus",
    )

    def __str__(self):
        return self.username


class FoodLikeStatus(models.Model):
    STATUS_CHOICES = (
        (0, 'none'),
        (1, 'like'),
        (2, 'dislike'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name='user_like_status')
    like_status = models.IntegerField(choices=STATUS_CHOICES)

    def __str__(self):
        return str(self.user) + ' ' + str(self.like_status) + ' ' + str(self.food)

    


