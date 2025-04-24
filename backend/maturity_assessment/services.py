from decimal import Decimal, InvalidOperation
from django.db import transaction
from collections import defaultdict
from form.models import FormularioRespondido, Resposta
from .models import MaturityAssessment, CategoriaMaturity, SubcategoriaMaturity

# Mapeamento de funções e categorias conforme NIST CSF 2.0
FUNCOES_CATEGORIAS = {
    "GV": {
        "nome": "Governar",
        "categorias": {
            "OC": "Contexto Organizacional",
            "RM": "Estratégia de Gestão de Risco",
            "RR": "Papéis, Responsabilidades e Autoridades",
            "PO": "Políticas",
            "OV": "Supervisão",
            "SC": "Riscos da Cadeia de Suprimentos"
        }
    },
    "ID": {
        "nome": "Identificar",
        "categorias": {
            "AM": "Gestão de Ativos",
            "RA": "Avaliação de Riscos",
            "IM": "Estratégia de Melhoria"
        }
    },
    "PR": {
        "nome": "Proteger",
        "categorias": {
            "AA": "Identidade, Autenticação e Controle de Acesso",
            "AT": "Conscientização e Treinamento",
            "DS": "Segurança de Dados",
            "PS": "Segurança da Plataforma",
            "IR": "Resiliência da Infraestrutura"
        }
    },
    "DE": {
        "nome": "Detectar",
        "categorias": {
            "CM": "Monitoramento",
            "AE": "Análise"
        }
    },
    "RS": {
        "nome": "Responder",
        "categorias": {
            "RP": "Planejamento",
            "CO": "Comunicação",
            "AN": "Análise",
            "MI": "Mitigação",
            "IM": "Melhorias"
        }
    },
    "RC": {
        "nome": "Recuperar",
        "categorias": {
            "RP": "Planejamento",
            "CO": "Comunicação",
            "IM": "Melhorias"
        }
    }
}

def texto_para_numero(texto):
    """Converte texto de maturidade para valor numérico"""
    if not texto:
        return Decimal("0.0")

    mapeamento = {
        "Inicial": Decimal("1.0"),
        "Repetido": Decimal("2.0"),
        "Definido": Decimal("3.0"),
        "Gerenciado": Decimal("4.0"),
        "Otimizado": Decimal("5.0"),
    }

    texto = texto.strip()
    if texto in mapeamento:
        return mapeamento[texto]

    try:
        return Decimal(str(texto))
    except (InvalidOperation, TypeError):
        return Decimal("0.0")

def calcular_status(media, objetivo):
    """Determina o status com base na média e objetivo"""
    if media >= objetivo * Decimal("1.2"):
        return "Excelente"
    elif media >= objetivo * Decimal("0.9"):
        return "Bom"
    elif media >= objetivo * Decimal("0.7"):
        return "Regular"
    elif media >= objetivo * Decimal("0.5"):
        return "Atenção"
    else:
        return "Crítico"

def extract_function_category(codigo_pergunta):
    """Extrai função e categoria do código da pergunta (ex: GV.OC-01 -> GV, OC)"""
    if not codigo_pergunta:
        return None, None
        
    parts = codigo_pergunta.split(".")
    if len(parts) < 2:
        return None, None
    
    function = parts[0]
    category_part = parts[1].split("-")[0] if "-" in parts[1] else parts[1]
    return function, category_part

def calculate_maturity(formulario_respondido_id: int):
    """Calcula a maturidade com base nas respostas do formulário"""
    try:
        formulario_respondido = FormularioRespondido.objects.get(
            id=formulario_respondido_id
        )

        with transaction.atomic():
            # Cria ou obtém a avaliação de maturidade
            maturity_assessment, created = MaturityAssessment.objects.get_or_create(
                formulario_respondido=formulario_respondido
            )
            
            # Limpa avaliações anteriores
            maturity_assessment.categorias_maturity.all().delete()

            # Estrutura para armazenar os dados
            function_data = defaultdict(
                lambda: {
                    'categorias': defaultdict(
                        lambda: {
                            'politica': [],
                            'pratica': [],
                            'perguntas': []
                        }
                    ),
                    'politica': [],
                    'pratica': []
                }
            )

            # Listas para armazenar todas as políticas e práticas
            todas_politicas = []
            todas_praticas = []

            # Coleta todas as respostas de uma vez
            respostas = Resposta.objects.filter(
                formulario_respondido=formulario_respondido
            ).select_related('pergunta')

            # Processa cada resposta
            for resposta in respostas:
                if not resposta.pergunta or not resposta.pergunta.codigo:
                    continue
                    
                pergunta = resposta.pergunta
                function_id, category_id = extract_function_category(pergunta.codigo)
                
                if not function_id or not category_id:
                    continue
                
                # Converte as respostas para valores numéricos
                politica = texto_para_numero(resposta.politica)
                pratica = texto_para_numero(resposta.pratica)
                
                # Armazena os dados
                function_data[function_id]['categorias'][category_id]['politica'].append(politica)
                function_data[function_id]['categorias'][category_id]['pratica'].append(pratica)
                function_data[function_id]['categorias'][category_id]['perguntas'].append(pergunta)
                
                function_data[function_id]['politica'].append(politica)
                function_data[function_id]['pratica'].append(pratica)
                
                # Adiciona às listas totais
                todas_politicas.append(politica)
                todas_praticas.append(pratica)

            # Calcula as médias e salva no banco de dados
            for function_id, f_data in function_data.items():
                # Calcula médias para cada categoria
                for category_id, c_data in f_data['categorias'].items():
                    if c_data['politica'] and c_data['pratica']:
                        try:
                            # Médias da categoria
                            media_politica = sum(c_data['politica']) / len(c_data['politica'])
                            media_pratica = sum(c_data['pratica']) / len(c_data['pratica'])
                            media_total = (media_politica + media_pratica) / Decimal("2.0")
                            
                            # Obtém o nome da categoria
                            category_name = FUNCOES_CATEGORIAS.get(function_id, {}).get('categorias', {}).get(category_id, f"{function_id}.{category_id}")
                            
                            # Cria a categoria de maturidade
                            categoria_maturity = CategoriaMaturity.objects.create(
                                maturity_assessment=maturity_assessment,
                                categoria=None,
                                nome=category_name,
                                sigla=f"{function_id}.{category_id}",
                                media_politica=media_politica.quantize(Decimal("0.1")),
                                media_pratica=media_pratica.quantize(Decimal("0.1")),
                                media_total=media_total.quantize(Decimal("0.1")),
                                objetivo=Decimal("3.0"),
                                status=calcular_status(media_total, Decimal("3.0")),
                                tipo='CATEGORIA'
                            )
                            
                            # Cria as subcategorias (perguntas individuais)
                            for pergunta in c_data['perguntas']:
                                resposta = next((r for r in respostas if r.pergunta == pergunta), None)
                                if resposta:
                                    politica = texto_para_numero(resposta.politica)
                                    pratica = texto_para_numero(resposta.pratica)
                                    
                                    SubcategoriaMaturity.objects.create(
                                        categoria_maturity=categoria_maturity,
                                        pergunta=pergunta,
                                        politica=politica,
                                        pratica=pratica,
                                        objetivo=Decimal("3.0"),
                                        descricao=pergunta.questao[:100] if pergunta.questao else "",
                                        tipo='PERGUNTA'
                                    )
                        except Exception as e:
                            continue

                # Calcula médias para a função
                if f_data['politica'] and f_data['pratica']:
                    try:
                        media_politica = sum(f_data['politica']) / len(f_data['politica'])
                        media_pratica = sum(f_data['pratica']) / len(f_data['pratica'])
                        media_total = (media_politica + media_pratica) / Decimal("2.0")
                        
                        # Cria registro para a função
                        CategoriaMaturity.objects.create(
                            maturity_assessment=maturity_assessment,
                            categoria=None,
                            nome=FUNCOES_CATEGORIAS.get(function_id, {}).get('nome', function_id),
                            sigla=function_id,
                            media_politica=media_politica.quantize(Decimal("0.1")),
                            media_pratica=media_pratica.quantize(Decimal("0.1")),
                            media_total=media_total.quantize(Decimal("0.1")),
                            objetivo=Decimal("3.0"),
                            status=calcular_status(media_total, Decimal("3.0")),
                            tipo='FUNCAO'
                        )
                    except Exception as e:
                        continue

            # Calcula as médias totais gerais
            if todas_politicas and todas_praticas:
                try:
                    media_total_politica = sum(todas_politicas) / len(todas_politicas)
                    media_total_pratica = sum(todas_praticas) / len(todas_praticas)
                    media_total_geral = (media_total_politica + media_total_pratica) / Decimal("2.0")
                    
                    # Atualiza a avaliação com as médias totais
                    maturity_assessment.media_total_politica = media_total_politica.quantize(Decimal("0.1"))
                    maturity_assessment.media_total_pratica = media_total_pratica.quantize(Decimal("0.1"))
                    maturity_assessment.media_total_geral = media_total_geral.quantize(Decimal("0.1"))
                    maturity_assessment.save()
                except Exception as e:
                    pass

            return maturity_assessment

    except FormularioRespondido.DoesNotExist:
        return type("ErrorObject", (), {"error": "Formulário respondido não encontrado."})
    except Exception as e:
        error_msg = f"Erro ao calcular maturidade: {str(e)}"
        return type("ErrorObject", (), {"error": error_msg})