from datetime import date
from sqlmodel import Field, SQLModel

class Cliente(SQLModel, table=True):
    cpf: int = Field(default=None, primary_key=True)
    nome: str
    idade: int

class Medico(SQLModel, table=True):
    crm: int = Field(default=None, primary_key=True)
    nome: str

class Produto(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    nome: str
    tipo: str

class Agendamento(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    crm: int = Field(default=None, foreign_key="medico.crm")
    cpf: int = Field(default=None, foreign_key="cliente.cpf")
    data: date

class ProdutoAgendamento(SQLModel, table=True):
    id_produto: int = Field(default=None, foreign_key="produto.id", primary_key=True)
    id_agendamento: int = Field(default=None, foreign_key="agendamento.id", primary_key=True)
