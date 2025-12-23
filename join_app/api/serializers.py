from rest_framework import serializers
from join_app.models import Contact, Task, Subtask, Category

class ContactSerializer(serializers.ModelSerializer):
    color = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Contact
        fields = '__all__'
        
class CategorySerializer(serializers.ModelSerializer):
    color = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = '__all__'
        
class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = '__all__'
        
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'