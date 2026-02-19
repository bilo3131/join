from rest_framework import serializers
from join_app.models import Contact, Task, Subtask, Category

class ContactSerializer(serializers.ModelSerializer):
    color = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Contact
        fields = '__all__'
        
class CategorySerializer(serializers.ModelSerializer):
    color = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = '__all__'
        
class SubtaskSerializer(serializers.ModelSerializer):
    completed = serializers.BooleanField(source='is_completed', required=False)

    class Meta:
        model = Subtask
        fields = ['id', 'title', 'completed']
        
class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True, required=False)
    
    class Meta:
        model = Task
        fields = ['id', 'process', 'title', 'description', 'category', 'assigned_to', 'due_date', 'priority', 'subtasks']
    
    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        assigned_to_data = validated_data.pop('assigned_to', [])
        task = Task.objects.create(**validated_data)
        task.assigned_to.set(assigned_to_data)
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=task, **subtask_data)
        return task
    
    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', None)
        assigned_to_data = validated_data.pop('assigned_to', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if assigned_to_data is not None:
            instance.assigned_to.set(assigned_to_data)
        
        if subtasks_data is not None:
            # Bestehende Subtasks löschen und neu erstellen
            instance.subtasks.all().delete()
            for subtask_data in subtasks_data:
                Subtask.objects.create(task=instance, **subtask_data)
        
        return instance