from pydantic import BaseModel

class Usuario(BaseModel):
    nome : str
    idade : int
    semestre : int
    tempo : str
    preferencia: str
    nivel : str