from fastapi import FastAPI, HTTPException
from .schemas.user import Usuario
from .core.config import settings
from google import genai
from google.genai.errors import ServerError
import time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def gerar_resposta_gemini(client, prompt):
    MODELOS = ["gemini-2.0-flash"]
    tentativas = 3

    for modelo in MODELOS:
        for tentativa in range(tentativas):
            try:
                response = client.models.generate_content(
                    model=modelo,
                    contents=prompt
                )
                return response.text

            except ServerError as e:
                print(f"[ERRO GEMINI] Modelo {modelo} falhou (tentativa {tentativa+1}).")
                print(e)
                time.sleep(1)

    raise HTTPException(
        status_code=503,
        detail="A IA está temporariamente indisponível. Tente novamente em alguns segundos."
    )


@app.post("/")
def pegar_infos(payload: Usuario):

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    prompt = f"""
        Você é um orientador acadêmico especializado em criar planos de estudo personalizados.

        Com base nos dados abaixo, gere um plano de estudos detalhado:

        Nome do estudante: {payload.nome}
        Idade: {payload.idade}
        Semestre atual: {payload.semestre}
        Tempo disponível por dia: {payload.tempo}
        Preferência de estudo: {payload.preferencia}
        Nível de conhecimento atual: {payload.nivel}

        ### OBJETIVOS DO PLANO:
        1. Recomendar conteúdos adequados ao semestre informado.
        2. Ajustar a carga de estudo ao tempo disponível por dia.
        3. Respeitar as preferências do aluno (ex: prática, teoria, projetos).
        4. Considerar o nível atual (iniciante, intermediário, avançado).
        5. Organizar o plano em uma estrutura clara, simples e aplicável.

        ### FORMATO DA RESPOSTA:
        Retorne em JSON, no formato:

        {{
        "resumo": "...",
        "metodologia": "...",
        "cronograma": [
            {{
            "dia": "Segunda-feira",
            "atividades": [
                "atividade 1",
                "atividade 2"
            ]
            }}
        ],
        "materiais_recomendados": [
            "livro ou curso 1",
            "livro ou curso 2"
        ],
        "observacoes": "..."
        }}

        ### REGRAS:
        - As atividades devem ser compatíveis com o semestre informado.
        - Adapte a profundidade ao nível (iniciante/intermediário/avançado).
        - Se o tempo disponível for baixo, foque no essencial.
        - Se a preferência for prática, dê prioridade a exercícios e projetos.
        - O cronograma deve cobrir 7 dias.
        - A resposta deve ser **somente JSON válido**, sem explicações extras.
    """

    resultado = gerar_resposta_gemini(client, prompt)

    return {"resultado": resultado}
