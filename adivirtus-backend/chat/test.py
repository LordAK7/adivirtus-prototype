from groq import Groq
import logging

logger = logging.getLogger(__name__)

class GroqChatbot:
    def __init__(self):
        self.client = Groq(
            api_key="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"
        )

    def get_response(self, user_message):
        try:
            logger.info(f"Starting Groq API call with message: {user_message}")
            
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=1024
            )

            assistant_message = chat_completion.choices[0].message.content
            logger.info(f"Received response from Groq: {assistant_message}")
            return assistant_message

        except Exception as e:
            logger.error(f"Error in Groq API call: {str(e)}")
            raise e 