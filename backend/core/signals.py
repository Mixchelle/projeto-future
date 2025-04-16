from django.contrib.auth.models import User, Permission
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.db.models.signals import m2m_changed
from django.contrib.auth.signals import user_logged_in
import logging

logger = logging.getLogger('django.security')

#🔹 O que isso faz?
#✅ Registra quando permissões de usuários são alteradas.
#✅ Registra logins bem-sucedidos e o IP do usuário.
@receiver(m2m_changed, sender=User.user_permissions.through)
def log_permission_changes(sender, instance, action, **kwargs):
    if action in ["post_add", "post_remove", "post_clear"]:
        logger.warning(f"Permissões do usuário {instance} foram alteradas.")

@receiver(user_logged_in)
def log_successful_login(sender, request, user, **kwargs):
    logger.info(f"Usuário {user.username} logou com sucesso - IP: {request.META.get('REMOTE_ADDR')}")
#----------------------------------------------------------------

@receiver(post_migrate)
def create_user_roles(sender, **kwargs):
    if sender.name == "core":
        roles = ["admin", "avaliador", "cliente"]
        for role in roles:
            group, created = Group.objects.get_or_create(name=role)
            if created:
                print(f"Grupo '{role}' criado!")

# Registrar Mudanças de Permissões / Se alguém alterar permissões de usuários, precisamos registrar essa ação.