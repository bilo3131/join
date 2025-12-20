from django.db import models
from datetime import date

from join_app.choices import ProcessChoices, PriorityChoices

# Create your models here.

class Contact(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    
class Category(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
    
class Subtask(models.Model):
    title = models.CharField(max_length=100)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

class Task(models.Model):    
    process = models.CharField(max_length=20, choices=ProcessChoices.choices, default=ProcessChoices.TODO)
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    assigned_to = models.ManyToManyField(Contact, related_name='tasks')
    due_date = models.DateField(default=date.today)
    subtask = models.ManyToManyField(Subtask, blank=True)    
    priority = models.CharField(max_length=10, choices=PriorityChoices.choices, default=PriorityChoices.MEDIUM)

    def __str__(self):
        return self.title
    
class Summary(models.Model):
    total_tasks = models.IntegerField()
    tasks_in_progress = models.IntegerField()
    tasks_awaiting_feedback = models.IntegerField()
    urgent_tasks = models.IntegerField()
    tasks_to_do = models.IntegerField()
    tasks_done = models.IntegerField()
    upcoming_deadline = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"Summary {self.id}"