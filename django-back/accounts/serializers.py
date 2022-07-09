from rest_framework import serializers
from django.contrib.auth import get_user_model

user = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = user
        fields = ('pk', 'username', 'password', 'region', 'first_name', 'last_name', "email",)


class EditUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = user
        fields = ('pk', 'username', 'region', 'first_name', 'last_name', "email",)
        read_only_fields = ('pk', 'username', 'first_name', 'last_name', "email",)


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    passwordConfirmation = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = user
        fields = ('old_password', 'password', 'passwordConfirmation')

    def validate(self, attrs):
        if attrs['password'] != attrs['passwordConfirmation']:
            raise serializers.ValidationError({'password': "비밀번호가 일치하지 않습니다."})
        if len(attrs['password']) < 8:
            raise serializers.ValidationError({'password': '비밀번호는 8자 이상 입력해주세요.'})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('이전 비밀번호가 일치하지 않습니다.')  # 이 부분이 안 될거 같습니다,,,
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance