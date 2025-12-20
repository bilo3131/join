from datetime import date
from rest_framework import generics
from django.db.models import Count, Q, Min
from rest_framework.response import Response
from rest_framework.views import APIView
from join_app.models import Contact, Subtask, Task, Category
from join_app.api.serializers import ContactSerializer, TaskSerializer, CategorySerializer, SubtaskSerializer


class ContactList(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SubtaskList(generics.ListCreateAPIView):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer

class SubtaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer

class TaskList(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
class SummaryList(APIView):
    def get(self, request, *args, **kwargs):
        stats = Task.objects.aggregate(
            total_tasks=Count('id'),
            tasks_in_progress=Count('id', filter=Q(process='in_progress')),
            tasks_awaiting_feedback=Count('id', filter=Q(process='awaiting_feedback')),
            urgent_tasks=Count('id', filter=Q(priority='urgent')),
            tasks_to_do=Count('id', filter=Q(process='todo')),
            tasks_done=Count('id', filter=Q(process='done')),
            upcoming_deadline=Min('due_date', filter=Q(
                priority='urgent', 
                due_date__gte=date.today()
            )),
        )
        
        return Response(stats)