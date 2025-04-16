from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permite acesso apenas para administradores.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

class IsSecurityManager(permissions.BasePermission):
    """
    Permite acesso apenas para usuários com o grupo 'security_manager'.
    """
    def has_permission(self, request, view):
        return request.user.groups.filter(name="security_manager").exists()
