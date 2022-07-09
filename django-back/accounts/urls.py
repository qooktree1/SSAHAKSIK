from django.urls import path
from . import views


app_name = 'accounts'
urlpatterns = [
    path('signup/', views.signup),
    path('edit/', views.edit),
    path('delete/', views.delete),
    path('change_password/<int:pk>/', views.ChangePasswordView.as_view(), name='auth_change_password'),
    path('password_reset/', views.password_reset_request, name="password_reset"),
]
