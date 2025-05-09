import random
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.shortcuts import get_object_or_404

from form.models import Formulario, FormularioRespondido, Pergunta, Resposta
from users.models import CustomUser


class Command(BaseCommand):
    help = "Popula o banco de dados com formulários respondidos de teste."

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Iniciando seeding de formulários respondidos...")

        # 1. Obter o formulário NIST 2.0
        try:
            formulario_nist = Formulario.objects.get(nome="NIST 2.0 de Maturidade")
            self.stdout.write(f"Formulário '{formulario_nist.nome}' encontrado.")
        except Formulario.DoesNotExist:
            raise CommandError(
                "O formulário 'NIST 2.0 de Maturidade' não foi encontrado. Certifique-se de que o seeder de formulário foi executado."
            )

        # Obter todas as perguntas para este formulário
        perguntas = Pergunta.objects.filter(formulario=formulario_nist)
        total_perguntas = perguntas.count()

        if total_perguntas != 106:
            self.stdout.write(
                self.style.WARNING(
                    f"Total de perguntas encontradas: {total_perguntas}. Esperado: 106."
                )
            )
        else:
            self.stdout.write(f"Total de perguntas encontradas: {total_perguntas}")

        # 2. Obter clientes (usaremos todos os clientes disponíveis)
        clientes = CustomUser.objects.filter(role="cliente")
        if not clientes.exists():
            raise CommandError(
                "Nenhum usuário com role='cliente' encontrado. Certifique-se de que o seeder de usuários foi executado."
            )

        # Obter um usuário staff para ser o responsável (se existir)
        responsavel = CustomUser.objects.filter(is_staff=True).first()
        if not responsavel:
            self.stdout.write(
                self.style.WARNING(
                    "Nenhum usuário staff encontrado para ser o responsável. Formulários respondidos serão criados sem responsável designado."
                )
            )

        # Níveis de maturidade possíveis
        niveis_maturidade = [
            "Inicial",
            "Repetido",
            "Definido",
            "Gerenciado",
            "Otimizado",
        ]

        # Exemplos de informações complementares
        exemplos_info_complementar = [
            "Implementamos políticas claras para esta área.",
            "Estamos em processo de revisão das práticas atuais.",
            "Temos documentação completa sobre este tópico.",
            "Falta alinhamento entre equipes nesta questão.",
            "Planejamos melhorias para o próximo trimestre.",
            "Já realizamos treinamentos específicos sobre este ponto.",
            "Necessitamos de mais recursos para implementar soluções adequadas.",
            "Este é um ponto forte da nossa organização.",
            "Identificamos vulnerabilidades que estão sendo tratadas.",
            "Contamos com ferramentas especializadas para este aspecto.",
        ]

        # Status para distribuir entre os formulários
        statuses = ["em_analise"]

        # 3. Criar Formulários Respondidos e Respostas para cada cliente
        for i, cliente in enumerate(clientes):
            current_status = statuses[i % len(statuses)]  # Cicla pelos status

            self.stdout.write(
                f"\nCriando formulário respondido para o cliente: {cliente.email} com status '{current_status}'"
            )

            # Cria ou obtém a versão 1 do FormularioRespondido para este cliente e formulário
            formulario_respondido, created = (
                FormularioRespondido.objects.update_or_create(
                    cliente=cliente,
                    formulario=formulario_nist,
                    versao=1,
                    defaults={
                        "status": current_status,
                        "responsavel": responsavel,
                        "observacoes_pendencia": (
                            "Observações de pendência de teste."
                            if current_status == "pendente"
                            else ""
                        ),
                        "progresso": 0.00,
                    },
                )
            )

            if created:
                self.stdout.write(
                    f" - FormularioRespondido (ID: {formulario_respondido.id}, Versão: {formulario_respondido.versao}) criado."
                )
            else:
                self.stdout.write(
                    f" - FormularioRespondido (ID: {formulario_respondido.id}, Versão: {formulario_respondido.versao}) atualizado."
                )
                # Remove respostas existentes para garantir que todas as perguntas terão respostas
                formulario_respondido.respostas.all().delete()
                self.stdout.write("   - Respostas existentes removidas para recriação.")

            # 4. Criar Respostas para cada pergunta
            respostas_criadas_count = 0
            for pergunta in perguntas:
                # Escolhe valores aleatórios
                politica_resposta = random.choice(niveis_maturidade)
                pratica_resposta = random.choice(niveis_maturidade)
                info_complementar = random.choice(exemplos_info_complementar)

                # Cria a Resposta para esta pergunta
                Resposta.objects.create(
                    formulario_respondido=formulario_respondido,
                    pergunta=pergunta,
                    usuario=cliente,
                    politica=politica_resposta,
                    pratica=pratica_resposta,
                    info_complementar=info_complementar,
                )
                respostas_criadas_count += 1

            self.stdout.write(
                f" - Total de {respostas_criadas_count} respostas criadas para o FormularioRespondido ID {formulario_respondido.id}."
            )

            # 5. Atualizar o progresso do formulário respondido
            if total_perguntas > 0:
                progresso = (
                    100.00  # Como todas as perguntas têm resposta, progresso é 100%
                )
                formulario_respondido.progresso = progresso
                formulario_respondido.save()
                self.stdout.write(
                    f" - Progresso atualizado para {formulario_respondido.progresso:.2f}%."
                )

        self.stdout.write(
            self.style.SUCCESS(
                "\nSeeding de formulários respondidos concluído com sucesso! Todas as perguntas foram respondidas."
            )
        )