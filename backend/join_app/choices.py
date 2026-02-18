from django.db import models

class ProcessChoices(models.TextChoices):
    TODO = 'todo', 'To Do'
    IN_PROGRESS = 'in_progress', 'In Progress'
    AWAITING_FEEDBACK = 'awaiting_feedback', 'Awaiting Feedback'
    DONE = 'done', 'Done'
    
class PriorityChoices(models.TextChoices):
    LOW = 'low', 'Low'
    MEDIUM = 'medium', 'Medium'
    URGENT = 'urgent', 'Urgent'