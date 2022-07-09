from django.shortcuts import render, get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from .serializers import DailyFoodListSerializer, FoodLikeStatusSerializer

from .models import Food, Region, SideDish, Date, DailyFood
from accounts.models import FoodLikeStatus

import datetime
from pytimekr import pytimekr


@api_view(['GET'])
@permission_classes([AllowAny])
def get_daily_food(request, region, year, month, day):
    # 주말인 경우
    isweekend = datetime.datetime(year, month, day).weekday()
    if isweekend == 5 or isweekend == 6:
        data = {"error": "weekend"}
        return Response(data, status=status.HTTP_404_NOT_FOUND)
    
    # 공식 공휴일(빨간날)인 경우
    kr_holidays = pytimekr.holidays(year=year)
    if datetime.date(year, month, day) in kr_holidays:
        data = {"error": "weekend"}
        return Response(data, status=status.HTTP_404_NOT_FOUND)        

    date = Date.objects.filter(date=f'{year}-{month}-{day}')
    # 데이터가 아직 없는 경우, 공휴일이나 주말이 아니지만 아직 등록 전
    if not date:
        data = {"error": "not yet"}
        return Response(data, status=status.HTTP_404_NOT_FOUND)

    daily_foods = DailyFood.objects.filter(region=region, date=date[0])
    if daily_foods:  # daily_food
        serializers = []  # 식단이 여러개 일 수도 있어서 전부 넣음. front 쪽에서 리스트로 요청
        for daily_food in daily_foods:
            serializer = DailyFoodListSerializer(daily_food).data

            if request.user.is_authenticated:  # 유저가 로그인한 상태인 경우
                if FoodLikeStatus.objects.filter(user=request.user, food=daily_food.food):  # food_like_status가 존재하는 경우
                    like_status = FoodLikeStatus.objects.filter(user=request.user, food=daily_food.food)[0].like_status
                else:  # food_like_status가 없는 경우 만들어주기.
                    new_like_status = FoodLikeStatus(user=request.user, food=daily_food.food, like_status=0)
                    new_like_status.save()
                    like_status = 0
            else:  # 비로그인 유저의 경우에도 메인 페이지를 볼 수 있음. 이 경우 user_like_status = 0으로 해둠.
                like_status = 0        
            user_like_status = {'user_like_status': like_status}
            serializer.update(user_like_status)
            
            serializers.append(serializer)

        return Response(serializers)

    # date는 등록되었지만 이 지역의 daily_foods가 없는 경우
    else:
        data = {"error": "not yet"}
        return Response(data, status=status.HTTP_404_NOT_FOUND)


# 좋아요 버튼 눌렀을 때
@api_view(['POST'])
def like_food(request, dailyfood_id):
    daily_food = get_object_or_404(DailyFood, id=dailyfood_id)
    food = daily_food.food
    user = request.user
    if food:
        # 이 유저의 이 음식의 user_like_status가 존재한다면
        if food.user_like_status.filter(user=user):
            tmp = food.user_like_status.filter(user=user)[0]  # 이 유저의 이 음식의 user_like_status

        # 존재하지 않는다면
        else:
            tmp = FoodLikeStatus(food=food, user=user, like_status=0)
            tmp.save()

        # 현재 like라면
        if tmp.like_status == 1:
            tmp.like_status = 0  # none으로 변경 후 저장
            tmp.save()

        # 현재 none, dislike라면
        else:
            tmp.like_status = 1  # like로 변경 후 저장
            tmp.save()        
        
        
        serializer = FoodLikeStatusSerializer(food)  # 현재 좋아요 한 사람수, 싫어요 한 사람 수 재계산
        a = serializer.data
        b = {'user_like_status': tmp.like_status}  # 이 유저의 like_status 상태
        a.update(b)  # 두개 합치기
        return Response(a)
    
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


# 싫어요 버튼 눌렀을 때, 포스트맨 확인 완료
@api_view(['POST'])
def dislike_food(request, dailyfood_id):
    daily_food = get_object_or_404(DailyFood, id=dailyfood_id)
    food = daily_food.food
    user = request.user
    if food:
        # 이 유저의 이 음식의 user_like_status가 존재한다면
        if food.user_like_status.filter(user=user):
            tmp = food.user_like_status.filter(user=user)[0]  # 이 유저의 이 음식의 user_like_status
        # 존재하지 않는다면
        else:
            tmp = FoodLikeStatus(food=food, user=user, like_status=0)
            tmp.save()

        # 현재 dislike라면
        if tmp.like_status == 2:
            tmp.like_status = 0  # none으로 변경 후 저장
            tmp.save()
                
        # 현재 none, like라면
        else:
            tmp.like_status = 2  # like로 변경 후 저장
            tmp.save()        

        serializer = FoodLikeStatusSerializer(food)  # 현재 좋아요 한 사람수, 싫어요 한 사람 수 재계산
        a = serializer.data
        b = {'user_like_status': tmp.like_status}  # 이 유저의 like_status 상태
        a.update(b)  # 두개 합치기
        return Response(a)
    
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


# @require_http_methods(['GET', 'POST'])
def register(request):
    if request.method == 'GET':
        return render(request, 'foods/register.html')

    elif request.method == 'POST':

        # 음식
        # 1) 음식 사진이 없는 경우 -> default 사진이 들어감
        if not request.FILES.get('image'):
            name = request.POST['food']
            if Food.objects.filter(name=name):
                food = Food.objects.get(name=name)
            else:
                food = Food(name=name)
                food.save()

        # 2) 음식 사진이 있는 경우
        else:
            name = request.POST['food']
            food_img = request.FILES['image']
            
            if Food.objects.filter(name=name):  # 기존 음식 존재하는 경우,
                food = Food.objects.get(name=name)
                food.food_img = food_img  # 음식 사진 갱신
                food.save()
            else:
                food = Food(name=name, food_img=food_img)
                food.save()

        # 날짜
        date = request.POST['date']
        if Date.objects.filter(date=date):
            date = Date.objects.get(date=date)
        else:
            date = Date(date=date)
            date.save()

        # 지역
        region = request.POST['region']
        region = Region.objects.get(id=region)

        # daily_food 생성
        daily_food = DailyFood(food=food, region=region, date=date)
        daily_food.save()

        # side_dish 추가
        side_dishes = request.POST['side_dish']
        side_dishes = list(map(lambda x: x.strip(), side_dishes.split(',')))
        for side_dish in side_dishes:
            if SideDish.objects.filter(name=side_dish):
                side_dish = SideDish.objects.get(name=side_dish)
            else:
                side_dish = SideDish(name=side_dish)
                side_dish.save()
            daily_food.side_dish.add(side_dish)

        return render(request, 'foods/register.html')

        
        

        
        
