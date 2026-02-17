from rest_framework import serializers
from django.contrib.auth.models import User
from auth_user_app.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        
class RegistrationSerializer(serializers.ModelSerializer):
    repeated_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'repeated_password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def validate(self, data):
        if data['password'] != data['repeated_password']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email is already in use.'})
        
        return data

    def create(self, validated_data):
        validated_data.pop('repeated_password')
        password = validated_data['password']
        username = validated_data['email']
        account = User.objects.create(**validated_data)
        account.set_password(password)
        account.save()
        return account