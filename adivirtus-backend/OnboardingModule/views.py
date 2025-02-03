from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from pyresparser import ResumeParser
import json
from datetime import datetime

# Create your views here.

class ResumeParserView(APIView):
    def post(self, request):
        try:
            # Get the uploaded file from request
            resume_file = request.FILES.get('resume')
            if not resume_file:
                return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

            # Create data directory if it doesn't exist
            data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
            os.makedirs(data_dir, exist_ok=True)

            # Parse resume
            parser = ResumeParser(resume_file)
            data = parser.get_extracted_data()

            # Generate unique filename using timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = os.path.join(data_dir, f'resume_data_{timestamp}.json')

            # Save parsed data to JSON file
            with open(output_file, 'w') as f:
                json.dump(data, f, indent=4)

            return Response({
                'message': 'Resume parsed successfully',
                'data': data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
