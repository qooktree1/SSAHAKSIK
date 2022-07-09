from django.contrib.auth import get_user_model
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.tokens import default_token_generator
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer, EditUserSerializer, ChangePasswordSerializer
from .models import User
import re
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.db.models.query_utils import Q
from django.core.mail import send_mail, BadHeaderError


# 회원가입 커스텀
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    password = request.data.get('password')
    passwordConfirmation = request.data.get('passwordConfirmation')
    email = request.data.get('email')
    username = request.data.get('username')

    errordict = { 'email': '', 'password1': '', 'password2': '', 'username': ''}

    # 중복된(가입된) username
    if User.objects.filter(username=username).exists():
        errordict['username'] = '이미 존재하는 아이디입니다.'

    # email 형식 맞지 않음
    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+[.]?\w{2,3}$'
    valid = re.search(regex, email)
    if not valid:
        errordict['email'] = '이메일 형식을 맞춰주세요.'

    # 중복된(가입된) email    
    if User.objects.filter(email=email).exists():
        errordict['email'] = '이미 가입된 이메일입니다.'

    # password 일치x
    if password != passwordConfirmation:
        errordict['password1'] = '비밀번호가 일치하지 않습니다.'

    # password 길이 8미만
    if len(password) < 8 or len(passwordConfirmation) < 8 :
        errordict['password2'] = '비밀번호는 8자 이상 입력해주세요.'

    if errordict != { 'email': '', 'password1': '', 'password2': '', 'username': ''}:
        return Response(errordict, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        return Response(serializer.data)


@api_view(['GET', 'PUT'])  # 정보 유저의 정보 보내주기, put -> 정보 받은 걸로 시리save
def edit(request):
    user = request.user
    if request.method == 'GET':
        serializer = EditUserSerializer(instance=user)
        return Response(serializer.data)
    elif request.method == 'PUT':

        serializer = EditUserSerializer(instance=user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)


class ChangePasswordView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer


@api_view(['DELETE'])
def delete(request):
    if request.user.is_authenticated:
        request.user.delete()
        # session 지우기. 단 탈퇴후 로그아웃순으로 처리. 먼저 로그아웃하면 해당 request 객체 정보가 없어져서 삭제가 안됨.
        auth_logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    if request.POST:
        data = request.POST['email']
    else:
        data = request.data['email']
    associated_users = get_user_model().objects.filter(Q(email=data))
    if associated_users.exists():
        for user in associated_users:
            subject = '[싸학식] 비밀번호 재설정'
            email_template_name = "accounts/password_reset_email.txt"
            content = {
                "email": user.email,
                'domain': '52.78.222.136',
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "user": user,
                'token': default_token_generator.make_token(user),
                'protocol': 'http',
            }
            email = render_to_string(email_template_name, content)
            try:
                send_mail(subject, email, 'ssahaksik@gmail.com' , [user.email], fail_silently=False)
            except BadHeaderError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)