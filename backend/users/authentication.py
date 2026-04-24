from rest_framework_simplejwt.authentication import JWTAuthentication

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
        return self.get_user(validated_token), validated_token
