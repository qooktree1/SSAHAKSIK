from dataclasses import field
from rest_framework import serializers
# from django.contrib.auth import get_user_model
from .models import Food, Region, SideDish, Date, DailyFood
from accounts.models import FoodLikeStatus


# 메인 페이지 식단 정보 조회
class DailyFoodListSerializer(serializers.ModelSerializer):

    class FoodSerializer(serializers.ModelSerializer):

        # 좋아요, 리뷰 모두 food와 연결되어 있어서 FoodSerializer 안에 필드를 만들었습니다.
        like_count = serializers.SerializerMethodField()
        dislike_count = serializers.SerializerMethodField()
        review_count = serializers.IntegerField(source='review_set.count', read_only=True)
        sentence = serializers.SerializerMethodField()

        class Meta:
            model = Food
            fields = '__all__'

        def get_like_count(self, obj):
            return obj.user_like_status.filter(like_status=1).count()

        def get_dislike_count(self, obj):
            return obj.user_like_status.filter(like_status=2).count()

        def get_sentence(self, obj):
            likes = obj.user_like_status.filter(like_status=1).count()
            dislikes = obj.user_like_status.filter(like_status=2).count()
            total = likes + dislikes
            if total == 0:  # 이후 숫자를 늘릴 예정. ~~개 이하 -> 아직 충분한 정보가 모이지 않았어요.
                return '아직 충분한 정보가 모이지 않았어요.'
            else:
                like_percentage = likes/total * 100
                if like_percentage > 85:
                    return '전쟁에 대비하세요.'
                elif like_percentage >= 70:
                    return '빨리 드시고 싶다면 지금부터 준비하셔야겠어요.'
                elif like_percentage >= 60:
                    return '오늘은 조금 북적이겠네요.'
                elif like_percentage > 55:
                    return '그리 나쁘지 않아요.'
                elif 45 <= like_percentage <= 55:
                    return '박빙이네요'
                elif like_percentage >= 30:
                    return '밥은 살기 위해 먹는 것. 많은 의미를 두지 말아요.'    
                elif like_percentage >= 15:
                    return '밖에서 드시는 것을 추천합니다.'
                else:
                    return '오늘은 밥 먹지 말고 공부하세요.'   


    class RegionSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = Region
            fields = '__all__'

    class SideDishSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = SideDish
            fields = '__all__'        

    class DateSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = Date
            fields = '__all__'        

    food = FoodSerializer()
    date = DateSerializer()
    region = RegionSerializer()
    side_dish = SideDishSerializer(many=True)

    class Meta:
        model = DailyFood
        fields = '__all__'


# 음식 좋아요나 싫어요 변화하면 음식 선호도 %가 반영 되어야 함
class FoodLikeStatusSerializer(serializers.ModelSerializer):

    like_count = serializers.SerializerMethodField()
    dislike_count = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = '__all__'

    def get_like_count(self, obj):
        return obj.user_like_status.filter(like_status=1).count()

    def get_dislike_count(self, obj):
        return obj.user_like_status.filter(like_status=2).count()
 