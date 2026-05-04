from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

def enforce_csrf(request):
    """
    Enforce CSRF validation for cookie based authentication.
    """
    def dummy_get_response(request):
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        
        # Determine raw token based on whether it passes through header or cookie
        if header is None:
            raw_token = request.COOKIES.get('access_token') or None
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        # Process the found token
        validated_token = self.get_validated_token(raw_token)
        
        # Enforce CSRF if token was provided via cookies and it's a mutation request
        if header is None:
            enforce_csrf(request)
            
        return self.get_user(validated_token), validated_token
