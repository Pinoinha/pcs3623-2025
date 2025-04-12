from sqlmodel import SQLModel, create_engine


DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL)

def criar_db_e_tabelas():
    SQLModel.metadata.create_all(engine)
