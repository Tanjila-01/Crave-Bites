import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import APIException

logger = logging.getLogger(__name__)


from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF that provides consistent error responses.
    """
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    
    if response is None:
        logger.error(f'Unhandled exception: {type(exc).__name__}: {str(exc)}')
        response = Response(
            {'error': 'An unexpected error occurred'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return response
