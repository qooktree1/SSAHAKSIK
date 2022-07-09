from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Review
from foods.models import DailyFood
from .serializers import ReviewSerializer, ReviewListSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_daily_food_review(request, dailyfood_id):
    daily_food = get_object_or_404(DailyFood, id=dailyfood_id)
    if daily_food:
        reviews = Review.objects.filter(food=daily_food.food)[::-1]
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


# 리뷰 생성, 포스트맨으로 확인 완료(사진도 업로드 가능)
@api_view(['POST'])
def review_create(request, dailyfood_id):
    daily_food = get_object_or_404(DailyFood, id=dailyfood_id)
    if daily_food:
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user, food=daily_food.food, region=daily_food.region)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'PUT', 'DELETE'])
def review_get_delete_or_update(request, review_pk):
    review = get_object_or_404(Review, pk=review_pk)

    # 리뷰 조회
    # 단일 리뷰를 조회할 일 없을 것 같아서 allowany 추가 안 함
    def review_get(request, review):
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    # 리뷰 삭제
    def review_delete(request, review):
        if request.user == review.user:
            review.delete()
            data = {
                'delete' : f'{review.user}가 쓰신 {review_pk}번 글이 삭제되었습니다.',
            }
            return Response(data, status=status.HTTP_204_NO_CONTENT)
        # 본인이 쓴 글이 아니거나 review_pk가 없는 경우라서 일단 400에러로 해둠
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # 리뷰 수정
    def review_update(request, review):
        updated_review = ReviewSerializer(review, data=request.data)
        if updated_review.is_valid(raise_exception=True):
            updated_review.save()
        
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    if request.method == 'GET':
        return review_get(request, review)
    elif request.method == 'DELETE':
        return review_delete(request, review)
    elif request.method == 'PUT':
        return review_update(request, review)