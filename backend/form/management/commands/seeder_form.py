from django.core.management.base import BaseCommand
from form.models import Formulario, Categoria, Pergunta


class Command(BaseCommand):
    help = "Popula o banco de dados com o formulário NIST 2.0 de Maturidade"

    def handle(self, *args, **kwargs):
        # Criar o formulário
        formulario, created = Formulario.objects.get_or_create(
            nome="NIST 2.0 de Maturidade"
        )

        categorias = {
            "Governança (GV)": "GV.OC",
            "Identificar (ID)": "ID.AS",
            "Proteger (PR)": "PR.AC",
            "Detectar (DE)": "DE.AN",
            "Responder (RS)": "RS.RP",
            "Recuperar (RC)": "RC.IM",
        }

        perguntas_por_categoria = {
            "Governança (GV)": [
                (
                    "GV.OC-01",
                    "A missão organizacional é compreendida e orienta a gestão de riscos cibernéticos?",
                ),
                (
                    "GV.OC-02",
                    "Os stakeholders internos e externos são compreendidos, e suas necessidades e expectativas em relação à gestão de riscos cibernéticos são entendidas e consideradas?",
                ),
                (
                    "GV.OC-03",
                    "Os requisitos legais, regulatórios e contratuais relacionados à cibersegurança — incluindo obrigações de privacidade e liberdades civis — são compreendidos e geridos?",
                ),
                (
                    "GV.OC-04",
                    "Os objetivos críticos, capacidades e serviços dos quais os stakeholders dependem ou esperam da organização são compreendidos e comunicados?",
                ),
                (
                    "GV.OC-05",
                    "Os resultados, capacidades e serviços dos quais a organização depende são compreendidos e comunicados?",
                ),
                (
                    "GV.RM-01",
                    "Os objetivos de gestão de risco são estabelecidos e acordados pelos stakeholders da organização?",
                ),
                (
                    "GV.RM-02",
                    "Declarações de apetite ao risco e tolerância ao risco são estabelecidas, comunicadas e mantidas?",
                ),
                (
                    "GV.RM-03",
                    "As atividades e resultados da gestão de riscos cibernéticos são incluídos nos processos de gestão de riscos empresariais?",
                ),
                (
                    "GV.RM-04",
                    "Uma direção estratégica que descreve opções apropriadas de resposta ao risco é estabelecida e comunicada?",
                ),
                (
                    "GV.RM-05",
                    "São estabelecidas linhas de comunicação para riscos cibernéticos em toda a organização, incluindo riscos de fornecedores e outras terceiras partes?",
                ),
                (
                    "GV.RM-06",
                    "Um método padronizado para calcular, documentar, categorizar e priorizar riscos cibernéticos é estabelecido e comunicado?",
                ),
                (
                    "GV.RM-07",
                    "Oportunidades estratégicas (ou seja, riscos positivos) são caracterizadas e incluídas nas discussões sobre risco cibernético da organização?",
                ),
                (
                    "GV.RR-01",
                    "A liderança organizacional é responsável e responsabilizada pelo risco cibernético e promove uma cultura que é consciente dos riscos, da ética e está em constante melhoria?",
                ),
                (
                    "GV.RR-02",
                    "Papéis, responsabilidades e autoridades relacionadas à gestão de risco cibernético são estabelecidos, comunicados, compreendidos e aplicados?",
                ),
                (
                    "GV.RR-03",
                    "Recursos adequados são alocados de forma proporcional à estratégia de risco cibernético, papéis, responsabilidades e políticas?",
                ),
                (
                    "GV.RR-04",
                    "A cibersegurança é incluída nas práticas de recursos humanos?",
                ),
                (
                    "GV.PO-01",
                    "Política para a gestão de riscos cibernéticos é estabelecida com base no contexto organizacional, estratégia de cibersegurança e prioridades e é comunicada e aplicada?",
                ),
                (
                    "GV.PO-02",
                    "Política para a gestão de riscos cibernéticos é revisada, atualizada, comunicada e aplicada para refletir mudanças nos requisitos, ameaças, tecnologia e missão organizacional?",
                ),
                (
                    "GV.OV-01",
                    "Os resultados da estratégia de gestão de riscos cibernéticos são revisados para informar e ajustar a estratégia e a direção?",
                ),
                (
                    "GV.OV-02",
                    "A estratégia de gestão de riscos cibernéticos é revisada e ajustada para garantir a cobertura dos requisitos e riscos organizacionais?",
                ),
                (
                    "GV.OV-03",
                    "O desempenho da gestão de riscos cibernéticos organizacional é avaliado e revisado para ajustes necessários?",
                ),
                (
                    "GV.SC-01",
                    "Um programa de gestão de riscos da cadeia de suprimentos de cibersegurança, estratégia, objetivos, políticas e processos são estabelecidos e acordados pelos stakeholders organizacionais?",
                ),
                (
                    "GV.SC-02",
                    "Papéis e responsabilidades de cibersegurança para fornecedores, clientes e parceiros são estabelecidos, comunicados e coordenados interna e externamente?",
                ),
                (
                    "GV.SC-03",
                    "A gestão de riscos da cadeia de suprimentos de cibersegurança é integrada à gestão de riscos de cibersegurança e empresarial, avaliação de riscos e processos de melhoria?",
                ),
                (
                    "GV.SC-04",
                    "Fornecedores são conhecidos e priorizados pela criticidade?",
                ),
                (
                    "GV.SC-05",
                    "Requisitos para abordar riscos de cibersegurança em cadeias de suprimentos são estabelecidos, priorizados e integrados em contratos e outros tipos de acordos com fornecedores e outras terceiras partes relevantes?",
                ),
                (
                    "GV.SC-06",
                    "Planejamento e diligências prévias são realizados para reduzir riscos antes de entrar em relações formais com fornecedores ou outras terceiras partes?",
                ),
                (
                    "GV.SC-07",
                    "Os riscos apresentados por um fornecedor, seus produtos e serviços e outras terceiras partes são compreendidos, registrados, priorizados, avaliados, respondidos e monitorados ao longo do relacionamento?",
                ),
                (
                    "GV.SC-08",
                    "Fornecedores relevantes e outras terceiras partes são incluídos no planejamento, resposta e recuperação de incidentes?",
                ),
                (
                    "GV.SC-09",
                    "Práticas de segurança da cadeia de suprimentos são integradas aos programas de gestão de riscos de cibersegurança e empresarial, e seu desempenho é monitorado ao longo do ciclo de vida de produtos e serviços tecnológicos?",
                ),
                (
                    "GV.SC-10",
                    "Planos de gestão de riscos da cadeia de suprimentos de cibersegurança incluem disposições para atividades que ocorrem após a conclusão de uma parceria ou acordo de serviço?",
                ),
            ],
            "Identificar (ID)": [
                (
                    "ID.AM-01",
                    "Inventários de hardware gerenciados pela organização são mantidos?",
                ),
                (
                    "ID.AM-02",
                    "Inventários de software, serviços e sistemas gerenciados pela organização são mantidos?",
                ),
                (
                    "ID.AM-03",
                    "Representações das comunicações de rede autorizadas da organização e dos fluxos de dados de rede internos e externos são mantidas?",
                ),
                (
                    "ID.AM-04",
                    "Inventários de serviços fornecidos por fornecedores são mantidos?",
                ),
                (
                    "ID.AM-05",
                    "Ativos são priorizados com base na classificação, criticidade, recursos e urgencia na missão?",
                ),
                (
                    "ID.AM-07",
                    "Inventários de dados e metadados correspondentes para tipos de dados designados são mantidos?",
                ),
                (
                    "ID.AM-08",
                    "Sistemas, hardware, software, serviços e dados são gerenciados ao longo de seus ciclos de vida?",
                ),
                (
                    "ID.RA-01",
                    "Vulnerabilidades nos ativos são identificadas, validadas e registradas?",
                ),
                (
                    "ID.RA-02",
                    "Inteligência sobre ameaças cibernéticas é recebida de fóruns e fontes de compartilhamento de informações?",
                ),
                (
                    "ID.RA-03",
                    "Ameaças internas e externas à organização são identificadas e registradas?",
                ),
                (
                    "ID.RA-04",
                    "Os urgencias potenciais e as probabilidades de ameaças explorarem vulnerabilidades são identificados e registrados?",
                ),
                (
                    "ID.RA-05",
                    "Ameaças, vulnerabilidades, probabilidades e urgencias são usados para entender o risco inerente e informar a priorização da resposta ao risco?",
                ),
                (
                    "ID.RA-06",
                    "Respostas ao risco são escolhidas, priorizadas, planejadas, rastreadas e comunicadas?",
                ),
                (
                    "ID.RA-07",
                    "Mudanças e exceções são gerenciadas, avaliadas quanto ao urgencia no risco, registradas e rastreadas?",
                ),
                (
                    "ID.RA-08",
                    "Processos para receber, analisar e responder a divulgações de vulnerabilidades são estabelecidos?",
                ),
                (
                    "ID.RA-09",
                    "A autenticidade e integridade do hardware e software são avaliadas antes da aquisição e uso?",
                ),
                ("ID.RA-10", "Fornecedores críticos são avaliados antes da aquisição?"),
                ("ID.IM-01", "Melhorias são identificadas a partir de avaliações?"),
                (
                    "ID.IM-02",
                    "Melhorias são identificadas a partir de testes de segurança e exercícios, incluindo aqueles realizados em coordenação com fornecedores e terceiros relevantes?",
                ),
                (
                    "ID.IM-03",
                    "Melhorias são identificadas a partir da execução de processos operacionais, procedimentos e atividades?",
                ),
                (
                    "ID.IM-04",
                    "Planos de resposta a incidentes e outros planos de cibersegurança que afetam as operações são estabelecidos, comunicados, mantidos e melhorados?",
                ),
            ],
            "Proteger (PR)": [
                (
                    "PR.AA-01",
                    "Identidades e credenciais de usuários, serviços e hardware autorizados são gerenciados pela organização?",
                ),
                (
                    "PR.AA-02",
                    "Identidades são comprovadas e vinculadas a credenciais com base no contexto das interações?",
                ),
                ("PR.AA-03", "Usuários, serviços e hardware são autenticados?"),
                (
                    "PR.AA-04",
                    "Asserções de identidade são protegidas, transmitidas e verificadas?",
                ),
                (
                    "PR.AA-05",
                    "Permissões de acesso, direitos e autorizações são definidos em uma política, gerenciados, aplicados e revisados, e incorporam os princípios de menor privilégio e separação de funções?",
                ),
                (
                    "PR.AA-06",
                    "O acesso físico aos ativos é gerenciado, monitorado e aplicado proporcionalmente ao risco?",
                ),
                (
                    "PR.AT-01",
                    "O pessoal recebe conscientização e treinamento para que possuam o conhecimento e habilidades necessárias para executar tarefas gerais com a consciência dos riscos de cibersegurança?",
                ),
                (
                    "PR.AT-02",
                    "Indivíduos em funções especializadas recebem conscientização e treinamento para que possuam o conhecimento e habilidades necessárias para executar tarefas relevantes com a consciência dos riscos de cibersegurança?",
                ),
                (
                    "PR.DS-01",
                    "A confidencialidade, integridade e disponibilidade dos dados em repouso são protegidas?",
                ),
                (
                    "PR.DS-02",
                    "A confidencialidade, integridade e disponibilidade dos dados em trânsito são protegidas?",
                ),
                (
                    "PR.DS-10",
                    "A confidencialidade, integridade e disponibilidade dos dados em uso são protegidas?",
                ),
                (
                    "PR.DS-11",
                    "Cópias de segurança dos dados são criadas, protegidas, mantidas e testadas?",
                ),
                (
                    "PR.PS-01",
                    "Práticas de gestão de configuração são estabelecidas e aplicadas?",
                ),
                (
                    "PR.PS-02",
                    "O software é mantido, substituído e removido proporcionalmente ao risco?",
                ),
                (
                    "PR.PS-03",
                    "O hardware é mantido, substituído e removido proporcionalmente ao risco?",
                ),
                (
                    "PR.PS-04",
                    "Registros de log são gerados e disponibilizados para monitoramento contínuo?",
                ),
                (
                    "PR.PS-05",
                    "A instalação e execução de software não autorizado são prevenidas?",
                ),
                (
                    "PR.PS-06",
                    "Práticas seguras de desenvolvimento de software são integradas e seu desempenho é monitorado ao longo do ciclo de vida de desenvolvimento de software?",
                ),
                (
                    "PR.IR-01",
                    "Redes e ambientes são protegidos contra acesso e uso lógico não autorizado?",
                ),
                (
                    "PR.IR-02",
                    "Os ativos tecnológicos da organização são protegidos contra ameaças ambientais?",
                ),
                (
                    "PR.IR-03",
                    "Mecanismos são implementados para alcançar requisitos de resiliência em situações normais e adversas?",
                ),
                (
                    "PR.IR-04",
                    "Capacidade de recurso adequada para garantir a disponibilidade é mantida?",
                ),
            ],
            "Detectar (DE)": [
                (
                    "DE.CM-01",
                    "Redes e serviços de rede são monitorados para identificar eventos potencialmente adversos?",
                ),
                (
                    "DE.CM-02",
                    "O ambiente físico é monitorado para identificar eventos potencialmente adversos?",
                ),
                (
                    "DE.CM-03",
                    "Atividades de pessoal e uso de tecnologia são monitorados para identificar eventos potencialmente adversos?",
                ),
                (
                    "DE.CM-06",
                    "Atividades e serviços de provedores de serviço externos são monitorados para identificar eventos potencialmente adversos?",
                ),
                (
                    "DE.CM-09",
                    "Hardware e software de computação, ambientes de execução e seus dados são monitorados para identificar eventos potencialmente adversos?",
                ),
                (
                    "DE.AE-02",
                    "Eventos potencialmente adversos são analisados para melhor entender as atividades associadas?",
                ),
                ("DE.AE-03", "Informações são correlacionadas de múltiplas fontes?"),
                (
                    "DE.AE-04",
                    "O urgencia estimado e o alcance dos eventos adversos são compreendidos?",
                ),
                (
                    "DE.AE-06",
                    "Informações sobre eventos adversos são fornecidas a pessoal autorizado e ferramentas?",
                ),
                (
                    "DE.AE-07",
                    "Inteligência de ameaças cibernéticas e outras informações contextuais são integradas à análise?",
                ),
                (
                    "DE.AE-08",
                    "Incidentes são declarados quando eventos adversos atendem aos critérios de incidente definidos?",
                ),
            ],
            "Responder (RS)": [
                (
                    "RS.MA-01",
                    "O plano de resposta a incidentes é executado em coordenação com terceiros relevantes uma vez que um incidente é declarado?",
                ),
                ("RS.MA-02", "Relatórios de incidentes são triados e validados?"),
                ("RS.MA-03", "Incidentes são categorizados e priorizados?"),
                (
                    "RS.MA-04",
                    "Incidentes são escalados ou elevados conforme necessário?",
                ),
                (
                    "RS.MA-05",
                    "Os critérios para iniciar a recuperação de incidentes são aplicados?",
                ),
                (
                    "RS.AN-03",
                    "Análises são realizadas para estabelecer o que ocorreu durante um incidente e a causa raiz do incidente?",
                ),
                (
                    "RS.AN-06",
                    "Ações realizadas durante uma investigação são registradas, e a integridade e a proveniência dos registros são preservadas?",
                ),
                (
                    "RS.AN-07",
                    "Dados e metadados do incidente são coletados, e sua integridade e proveniência são preservadas?",
                ),
                ("RS.AN-08", "A magnitude de um incidente é estimada e validada?"),
                (
                    "RS.CO-02",
                    "Partes interessadas internas e externas são notificadas dos incidentes?",
                ),
                (
                    "RS.CO-03",
                    "Informações são compartilhadas com partes interessadas internas e externas designadas?",
                ),
                ("RS.MI-01", "Incidentes são contidos?"),
                ("RS.MI-02", "Incidentes são erradicados?"),
            ],
            "Recuperar (RC)": [
                (
                    "RC.RP-01",
                    "A parte de recuperação do plano de resposta a incidentes é executada uma vez iniciada a partir do processo de resposta a incidentes?",
                ),
                (
                    "RC.RP-02",
                    "Ações de recuperação são selecionadas, dimensionadas, priorizadas e realizadas?",
                ),
                (
                    "RC.RP-03",
                    "A integridade dos backups e outros ativos de restauração é verificada antes de usá-los para restauração?",
                ),
                (
                    "RC.RP-04",
                    "Funções críticas de missão e gestão de riscos de cibersegurança são consideradas para estabelecer normas operacionais pós-incidente?",
                ),
                (
                    "RC.RP-05",
                    "A integridade dos ativos restaurados é verificada, sistemas e serviços são restaurados, e o status operacional normal é confirmado?",
                ),
                (
                    "RC.RP-06",
                    "O fim da recuperação de incidentes é declarado com base em critérios, e a documentação relacionada ao incidente é completada?",
                ),
                (
                    "RC.CO-03",
                    "Atividades de recuperação e progresso na restauração das capacidades operacionais são comunicados a partes interessadas internas e externas designadas?",
                ),
                (
                    "RC.CO-04",
                    "Atualizações públicas sobre a recuperação de incidentes são compartilhadas usando métodos e mensagens aprovados?",
                ),
            ],
        }

        for categoria_nome, codigo_base in categorias.items():
            categoria, _ = Categoria.objects.get_or_create(
                nome=categoria_nome, formulario=formulario
            )

            for codigo, questao in perguntas_por_categoria[categoria_nome]:
                Pergunta.objects.get_or_create(
                    questao=questao,
                    codigo=codigo,
                    categoria=categoria,
                    formulario=formulario,
                )

        self.stdout.write(self.style.SUCCESS("Banco de dados populado com sucesso!"))
