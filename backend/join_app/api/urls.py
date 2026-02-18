from django.urls import path
from .views import *

urlpatterns = [
    path('contacts/', ContactList.as_view(), name='contact-list'),
    path('contacts/<int:pk>/', ContactDetail.as_view(), name='contact-detail'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),
    path('tasks/', TaskList.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task-detail'),
    path('summary/', SummaryList.as_view(), name='summary-list'),
]