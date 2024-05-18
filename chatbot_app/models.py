from django.db import models

class Message(models.Model):
    content = models.TextField()
    response = models.TextField()

class ChatMessage(models.Model):
    session_id = models.CharField(max_length=255)
    message_text = models.TextField()
    is_user = models.BooleanField()  # True if the message is from the user, False if it's from the bot
    timestamp = models.DateTimeField(auto_now_add=True)
    signature = models.CharField(max_length=255, null=True, blank=True)  # Новое поле для подписи

    def __str__(self):
        return f"{self.message_text[:50]}... ({self.is_user})"