from django.urls import path
from . import views

app_name = 'foods'
urlpatterns = [
    # 메인 페이지에서 오늘의 식단 조회
    path('<int:region>/<int:year>/<int:month>/<int:day>/', views.get_daily_food),

    # 음식 좋아요 버튼 클릭
    path('<int:dailyfood_id>/like/', views.like_food),

    # 음식 싫어요 버튼 클릭
    path('<int:dailyfood_id>/dislike/', views.dislike_food),

    # 데일리 푸드 등록 페이지, 임시로 register이라고 만들었습니다.
    path('register/', views.register, name='register'),
]
