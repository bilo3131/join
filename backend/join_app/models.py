from django.db import models
from random import randint
from join_app.choices import ProcessChoices, PriorityChoices


def _random_color():
    return randint(0, 355)

# Create your models here.

class Contact(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    color = models.IntegerField(default=_random_color, editable=False)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.IntegerField(default=_random_color, editable=False)
    
    def __str__(self):
        return self.name
    
class Task(models.Model):    
    process = models.CharField(max_length=20, choices=ProcessChoices.choices, default=ProcessChoices.TODO)
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    assigned_to = models.ManyToManyField(Contact, related_name='tasks')
    due_date = models.DateField()
    priority = models.CharField(max_length=10, choices=PriorityChoices.choices, default=PriorityChoices.LOW)

    def __str__(self):
        return self.title

class Subtask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    title = models.CharField(max_length=100)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
