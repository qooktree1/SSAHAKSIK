from django.urls import path
from . import views

app_name = 'communities'
urlpatterns = [
    path('<int:dailyfood_id>/review/', views.get_daily_food_review),  # 메인 페이지에서 오늘의 식단 리뷰 조회
    path('<int:dailyfood_id>/create/', views.review_create),
    path('<int:review_pk>/', views.review_get_delete_or_update),
]
