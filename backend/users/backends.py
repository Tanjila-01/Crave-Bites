from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # In our implementation, the frontend sends 'username' but it might contain an email.
        # We'll check if a user matches the email or username.
        try:
            # Check by email first (case-insensitive)
            user = User.objects.get(email__iexact=username)
        except User.DoesNotExist:
            try:
                # Fallback to checking by username
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
