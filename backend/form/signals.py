@receiver(post_save, sender=Resposta)
def atualizar_progresso(sender, instance, **kwargs):
    formulario_respondido = instance.formulario_respondido
    total_perguntas = formulario_respondido.formulario.perguntas.count()

    # Conta apenas respostas que não estão vazias
    respondidas = formulario_respondido.respostas.exclude(
        politica="", pratica="", info_complementar="", anexos=""
    ).count()

    progresso = (respondidas / total_perguntas) * 100 if total_perguntas > 0 else 0
    formulario_respondido.progresso = round(progresso, 2)

    if progresso == 100 and formulario_respondido.status == "rascunho":
        formulario_respondido.status = "analise"

    formulario_respondido.save()
