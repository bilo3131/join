from rest_framework import serializers
from django.contrib.auth.models import User
from auth_user_app.models import UserProfile
from join_app.models import Contact

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        
class RegistrationSerializer(serializers.ModelSerializer):
    repeated_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'repeated_password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'username': {
                'required': False,
                'default': ''
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
        password = validated_data.pop('password')
        validated_data['username'] = validated_data['email']
        account = User.objects.create(**validated_data)
        account.set_password(password)
        account.save()

        Contact.objects.create(
            firstname=account.first_name,
            lastname=account.last_name,
            email=account.email,
        )

        return account