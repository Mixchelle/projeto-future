import logging
import time

logger = logging.getLogger('django.security')

class SuspiciousActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.failed_logins = {}

    def __call__(self, request):
        response = self.get_response(request)

        if request.path == '/admin/login/' and request.method == 'POST':
            ip = request.META.get('REMOTE_ADDR')
            now = time.time()

            if ip in self.failed_logins and (now - self.failed_logins[ip]) < 10:
                logger.warning(f"Possível ataque de força bruta detectado do IP: {ip}")
            self.failed_logins[ip] = now

        return response
#✅ Detecta tentativas de login repetidas e gera alertas.