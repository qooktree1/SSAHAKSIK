from rest_framework import serializers
from django.contrib.auth import get_user_model

from foods.models import Food, Region
from .models import Review


# 메인 페이지 조회시 리뷰 전체 조회
class ReviewListSerializer(serializers.ModelSerializer):

    class UserSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = get_user_model()
            fields = ('id', 'username',)

    user = UserSerializer()

    class Meta:
        model = Review
        fields= '__all__'


# 리뷰 생성
class ReviewCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = ('review', 'review_img',)


class ReviewSerializer(serializers.ModelSerializer):

    class UserSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = get_user_model()
            fields = ('id', 'username',)

    class FoodSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = Food
            fields = ('id', 'name',)
    
    class RegionSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = Region
            fields = ('id', 'name',)

    user = UserSerializer(read_only=True)
    food = FoodSerializer(read_only=True)
    region = RegionSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'    