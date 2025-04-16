from django.core.management.base import BaseCommand
from users.models import CustomUser


class Command(BaseCommand):
    help = "Cria usuários de teste (cliente, subcliente, funcionario, gestor, superusuário)"

    def handle(self, *args, **kwargs):
        # Criação de superusuário
        superuser_email = "dev@test.com"
        superuser_password = "dev12345"

        if not CustomUser.objects.filter(email=superuser_email).exists():
            superuser = CustomUser.objects.create_superuser(
                email=superuser_email,
                password=superuser_password,
                username="admin",
                nome="Desenvolvedor Admin",
                role="gestor",
                is_staff=True,
                is_superuser=True,
            )
            self.stdout.write(self.style.SUCCESS("Superusuário criado com sucesso."))
        else:
            self.stdout.write("Superusuário já existe.")

        # Criação de cliente 1
        cliente, created = CustomUser.objects.get_or_create(
            email="cliente@example.com",
            defaults={
                "username": "cliente_user",
                "nome": "Cliente Exemplo",
                "role": "cliente",
                "is_staff": False,
                "is_superuser": False,
            },
        )
        if created:
            cliente.set_password("123456")
            cliente.save()
            self.stdout.write(self.style.SUCCESS("Cliente 1 criado com sucesso."))
        else:
            self.stdout.write("Cliente 1 já existe.")

            # Criação de cliente 2
            cliente, created = CustomUser.objects.get_or_create(
                email="cliente2@example.com",
                defaults={
                    "username": "cliente2_user",
                    "nome": "Cliente2 Exemplo",
                    "role": "cliente",
                    "is_staff": False,
                    "is_superuser": False,
                },
            )
        if created:
            cliente.set_password("123456")
            cliente.save()
            self.stdout.write(self.style.SUCCESS("Cliente 1 criado com sucesso."))
        else:
            self.stdout.write("Cliente 2 já existe.")

        # Criação de cliente 3
        cliente3, created = CustomUser.objects.get_or_create(
            email="cliente3@example.com",
            defaults={
                "username": "cliente3_user",
                "nome": "Cliente 3",
                "role": "cliente",
                "is_staff": False,
                "is_superuser": False,
            },
        )
        if created:
            cliente3.set_password("123456")
            cliente3.save()
            self.stdout.write(self.style.SUCCESS("Cliente 3 criado com sucesso."))
        else:
            self.stdout.write("Cliente 3 já existe.")

        cliente, created = CustomUser.objects.get_or_create(
            email="cliente4@example.com",
            defaults={
                "username": "cliente4_user",
                "nome": "Cliente4 Exemplo",
                "role": "cliente",
                "is_staff": False,
                "is_superuser": False,
            },
        )
        if created:
            cliente.set_password("123456")
            cliente.save()
            self.stdout.write(self.style.SUCCESS("Cliente 1 criado com sucesso."))
        else:
            self.stdout.write("Cliente 4 já existe.")

        # Criação de subcliente
        subcliente, created = CustomUser.objects.get_or_create(
            email="subcliente@example.com",
            defaults={
                "username": "subcliente_user",
                "nome": "Subcliente Exemplo",
                "role": "subcliente",
                "cliente": cliente,
                "is_staff": False,
                "is_superuser": False,
            },
        )
        if created:
            subcliente.set_password("123456")
            subcliente.save()
            self.stdout.write(self.style.SUCCESS("Subcliente criado com sucesso."))
        else:
            self.stdout.write("Subcliente já existe.")

        # Criação de funcionário
        funcionario, created = CustomUser.objects.get_or_create(
            email="funcionario@example.com",
            defaults={
                "username": "funcionario_user",
                "nome": "Funcionário Exemplo",
                "role": "funcionario",
                "is_staff": True,
                "is_superuser": False,
            },
        )
        if created:
            funcionario.set_password("123456")
            funcionario.save()
            self.stdout.write(self.style.SUCCESS("Funcionário criado com sucesso."))
        else:
            self.stdout.write("Funcionário já existe.")

        # Criação de gestor
        gestor, created = CustomUser.objects.get_or_create(
            email="gestor@example.com",
            defaults={
                "username": "gestor_user",
                "nome": "Gestor Exemplo",
                "role": "gestor",
                "is_staff": True,
                "is_superuser": False,
            },
        )
        if created:
            gestor.set_password("123456")
            gestor.save()
            self.stdout.write(self.style.SUCCESS("Gestor criado com sucesso."))
        else:
            self.stdout.write("Gestor já existe.")
