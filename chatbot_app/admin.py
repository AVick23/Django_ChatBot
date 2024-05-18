from django.contrib import admin
from .models import Message, ChatMessage

admin.site.register(Message)
admin.site.register(ChatMessage)