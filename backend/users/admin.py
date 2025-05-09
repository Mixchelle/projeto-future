from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Remova 'username' dos campos de ordenação
    ordering = ('email',)  # Agora ordena por email
    
    # Ajuste os campos exibidos na lista de usuários
    list_display = ('email', 'role', 'is_staff')
    
    # Ajuste os fieldsets para remover referências ao username
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('User role', {'fields': ('role',)}),
    )
    
    # Ajuste o add_fieldsets para o formulário de criação
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)