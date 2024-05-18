from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import get_programs, get_direction_info, save_question, get_answer, load_chat, save_message, handle_question

urlpatterns = [
    path('', views.chat, name='chat'),  # URL для функции chat
    path('get_answer/', views.get_answer, name='get_answer'),
    path('button1/', views.button1, name='button1'),
    path('button2/', views.button2, name='button2'),
    path('get_programs/', get_programs, name='get_programs'),
    path('get_direction_info/', get_direction_info, name='get_direction_info'),
    path('save_question/', save_question, name='save_question'),
    path('get_answer/', get_answer, name='get_answer'),
    path('save_message/', save_message, name='save_message'),
    path('load_chat/', load_chat, name='load_chat'),
    path('handle_question/', handle_question, name='handle_question'),
    path('upload_file/', views.upload_file, name='upload_file'),
    path('progress/', views.progress, name='progress/'),
]