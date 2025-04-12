from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from db import engine, criar_db_e_tabelas
from models import *
import datetime

class AgendamentoResponse:
    id: int
    cpf: int
    crm: int
    data: date
    produtos: list[Produto]

    def __init__(self, agendamento: Agendamento, produtos: list[Produto]):
        self.id = agendamento.id
        self.cpf = agendamento.cpf
        self.crm = agendamento.crm
        self.data = agendamento.data
        self.produtos = produtos

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_sessao():
    with Session(engine) as session:
        yield session

@app.on_event("startup")
def on_startup():
    criar_db_e_tabelas()

@app.post("/clientes/")
def post_cliente(cliente: Cliente, session: Session = Depends(get_sessao)):
    session.add(cliente)
    session.commit()
    session.refresh(cliente)
    return cliente

@app.get("/clientes/")
def get_clientes(session: Session = Depends(get_sessao)):
    return session.exec(select(Cliente)).all()

@app.get("/clientes/{cpf}")
def get_cliente(cpf: str, session: Session = Depends(get_sessao)):
    query = select(Cliente).where(Cliente.cpf == cpf)
    db_cliente = session.exec(query).first()

    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    return db_cliente

@app.put("/clientes/{cpf}")
def put_cliente(cpf: str, cliente: Cliente, session: Session = Depends(get_sessao)):
    query = select(Cliente).where(Cliente.cpf == cpf)
    db_cliente = session.exec(query).first()

    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    db_cliente.nome = cliente.nome
    db_cliente.idade = cliente.idade

    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)

    return db_cliente

@app.delete("/clientes/{cpf}")
def excluir_cliente(cpf: str, session: Session = Depends(get_sessao)):
    query = select(Cliente).where(Cliente.cpf == cpf)
    db_cliente = session.exec(query).first()
    
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    session.delete(db_cliente)
    session.commit()
    
    return {"ok": True}

@app.post("/agendamentos/")
def post_agendamento(agendamento: Agendamento, session: Session = Depends(get_sessao)):
    dataCorreta = datetime.datetime.strptime(str(agendamento.data), "%Y-%m-%d").date()
    agendamento.data = dataCorreta
    session.add(agendamento)
    session.commit()
    session.refresh(agendamento)
    return agendamento

@app.get("/agendamentos/")
def get_agendamentos(session: Session = Depends(get_sessao)):
    agendamentos = session.exec(select(Agendamento)).all()

    return agendamentos

@app.get("/agendamentos/{id}")
def get_agendamento(id: int, session: Session = Depends(get_sessao)):
    query = select(Agendamento).where(Agendamento.id == id)
    db_agendamento = session.exec(query).first()

    if not db_agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    query_produtos = select(ProdutoAgendamento).join(Agendamento)
    print("---------------")
    print(query_produtos)
    print("---------------")
    resultados = session.exec(query_produtos).all()
    print(resultados)
    produtos = []

    return AgendamentoResponse(db_agendamento, produtos)

@app.put("/agendamentos/{id}")
def put_agendamento(id: str, agendamento: Agendamento, session: Session = Depends(get_sessao)):
    query = select(Agendamento).where(Agendamento.id == id)
    db_agendamento = session.exec(query).first()

    if not db_agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    db_agendamento.crm = agendamento.crm

    dataCorreta = datetime.datetime.strptime(str(agendamento.data), "%Y-%m-%d").date()
    db_agendamento.data = dataCorreta

    session.add(db_agendamento)
    session.commit()
    session.refresh(db_agendamento)

    return db_agendamento

@app.delete("/agendamentos/{id}")
def excluir_agendamento(id: str, session: Session = Depends(get_sessao)):
    query = select(Agendamento).where(Agendamento.id == id)
    db_agendamento = session.exec(query).first()
    
    if not db_agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    session.delete(db_agendamento)
    session.commit()
    
    return {"ok": True}

@app.post("/medicos/")
def post_medico(medico: Medico, session: Session = Depends(get_sessao)):
    session.add(medico)
    session.commit()
    session.refresh(medico)
    return medico

@app.get("/medicos/")
def get_medicos(session: Session = Depends(get_sessao)):
    return session.exec(select(Medico)).all()

@app.put("/medicos/{crm}")
def put_medico(crm: str, medico: Medico, session: Session = Depends(get_sessao)):
    query = select(Medico).where(Medico.crm == crm)
    db_medico = session.exec(query).first()

    if not db_medico:
        raise HTTPException(status_code=404, detail="Médico não encontrado")

    db_medico.crm = medico.crm
    db_medico.nome = medico.nome

    session.add(db_medico)
    session.commit()
    session.refresh(db_medico)

    return db_medico

@app.delete("/medicos/{crm}")
def excluir_medico(crm: str, session: Session = Depends(get_sessao)):
    query = select(Medico).where(Medico.crm == crm)
    db_medico = session.exec(query).first()
    
    if not db_medico:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    
    session.delete(db_medico)
    session.commit()
    
    return {"ok": True}

@app.post("/produtos/")
def post_produto(produto: Produto, session: Session = Depends(get_sessao)):
    session.add(produto)
    session.commit()
    session.refresh(produto)
    return produto

@app.get("/produtos/")
def get_produtos(session: Session = Depends(get_sessao)):
    return session.exec(select(Produto)).all()

@app.put("/produtos/{id}")
def put_produto(id: str, produto: Produto, session: Session = Depends(get_sessao)):
    query = select(Produto).where(Produto.id == id)
    db_produto = session.exec(query).first()

    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    db_produto.nome = produto.nome
    db_produto.tipo = produto.tipo

    session.add(db_produto)
    session.commit()
    session.refresh(db_produto)

    return db_produto

@app.delete("/produtos/{id}")
def excluir_produto(id: str, session: Session = Depends(get_sessao)):
    query = select(Produto).where(Produto.id == id)
    db_produto = session.exec(query).first()
    
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    session.delete(db_produto)
    session.commit()
    
    return {"ok": True}

@app.post("/produtoAgendamentos/")
def post_produtoAgendamento(produtoAgendamento: ProdutoAgendamento, session: Session = Depends(get_sessao)):
    session.add(produtoAgendamento)
    session.commit()
    session.refresh(produtoAgendamento)
    return produtoAgendamento

@app.get("/produtoAgendamentos/")
def get_produtoAgendamentos(session: Session = Depends(get_sessao)):
    return session.exec(select(ProdutoAgendamento)).all()

# @app.put("/produtoAgendamentos/{id}")
# def put_produtoAgendamento(id: str, produtoAgendamento: ProdutoAgendamento, session: Session = Depends(get_sessao)):
#     query = select(ProdutoAgendamento).where(produtoAgendamento.id == id)
#     db_produtoAgendamento = session.exec(query).first()
#
#     if not db_produtoAgendamento:
#         raise HTTPException(status_code=404, detail="produtoAgendamento não encontrado")
#
#     db_produtoAgendamento.id_agendamento = produtoAgendamento.id_agendamento
#     db_produtoAgendamento.id_produto = produtoAgendamento.id_produto
#
#     session.add(db_produtoAgendamento)
#     session.commit()
#     session.refresh(db_produtoAgendamento)
#
#     return db_produtoAgendamento
#
# @app.delete("/produtoAgendamentos/{id}")
# def excluir_produtoAgendamentoAgendamento(id: str, session: Session = Depends(get_sessao)):
#     query = select(ProdutoAgendamento).where(ProdutoAgendamento.id == id)
#     db_produtoAgendamento = session.exec(query).first()
#     
#     if not db_produtoAgendamento:
#         raise HTTPException(status_code=404, detail="produtoAgendamento não encontrado")
#     
#     session.delete(db_produtoAgendamento)
#     session.commit()
#     
#     return {"ok": True}
