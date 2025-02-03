from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from .test import GroqChatbot
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    chatbot = GroqChatbot()

    def create(self, request, *args, **kwargs):
        user_message = None
        try:
            # Log incoming request data
            logger.info(f"Received request data: {request.data}")
            
            # Create user message
            user_message = Message.objects.create(
                text=request.data.get('text'),
                is_bot=False
            )
            logger.info(f"Created user message: {user_message.text}")

            # Get response from Groq
            bot_response_text = self.chatbot.get_response(request.data.get('text'))
            logger.info(f"Bot response: {bot_response_text}")

            if not bot_response_text:
                raise Exception("Empty response from Groq")

            # Create bot response
            bot_response = Message.objects.create(
                text=bot_response_text,
                is_bot=True
            )

            # Return both messages
            serializer = self.get_serializer([user_message, bot_response], many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error in ChatViewSet: {str(e)}")
            messages = []
            if user_message:
                messages.append(user_message)
            error_response = Message.objects.create(
                text="I apologize, but I encountered an error. Please try again.",
                is_bot=True
            )
            messages.append(error_response)
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
