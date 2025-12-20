from django.urls import path
from .views import *

urlpatterns = [
    path('contacts/', ContactList.as_view(), name='contact-list'),
    path('contacts/<int:pk>/', ContactDetail.as_view(), name='contact-detail'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('subtasks/', SubtaskList.as_view(), name='subtask-list'),
    path('subtasks/<int:pk>/', SubtaskDetail.as_view(), name='subtask-detail'),
    path('tasks/', TaskList.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task-detail'),
    path('summary/', SummaryList.as_view(), name='summary-list'),
]