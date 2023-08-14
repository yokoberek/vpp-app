# coding: utf-8
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

from app import session
from app import login_manager
from flask_login import UserMixin

Base = declarative_base()
metadata = Base.metadata


@login_manager.user_loader
def load_user(user_id):
    return session.query(Credential).filter(Credential.idcredentials == user_id).first()


class Account(Base):
    __tablename__ = "accounts"

    idaccounts = Column(Integer, primary_key=True)
    nameaccounts = Column(String(45), nullable=False)


t_electrbill = Table(
    "electrbill",
    metadata,
    Column("daytime", DateTime, nullable=False),
    Column("billVpp1", Float(asdecimal=True)),
    Column("billVpp2", Float(asdecimal=True)),
    Column("billVpp3", Float(asdecimal=True)),
)


class Emsdatum(Base):
    __tablename__ = "emsdata"

    id = Column(Integer, primary_key=True)
    date = Column(DateTime)
    v3 = Column(Float)
    v9 = Column(Float)
    v10 = Column(Float)
    v11 = Column(Float)
    v12 = Column(Float)
    v13 = Column(Float)
    v14 = Column(Float)


t_emsdata2 = Table(
    "emsdata2",
    metadata,
    Column("id_sensor", String(100), nullable=False),
    Column("value", Integer),
    Column("timestamp", DateTime),
)


t_emsdata_backup = Table(
    "emsdata_backup",
    metadata,
    Column("id_sensor", String(100), nullable=False),
    Column("value", Integer),
    Column("timestamp", DateTime),
)


t_lastBill = Table(
    "lastBill",
    metadata,
    Column("billVpp1", Float(asdecimal=True)),
    Column("billVpp2", Float(asdecimal=True)),
    Column("billVpp3", Float(asdecimal=True)),
    Column("id", Integer),
)


class LastxBill(Base):
    __tablename__ = "lastxBill"

    id = Column(Integer, primary_key=True)
    billVpp1 = Column(Float(asdecimal=True))
    billVpp2 = Column(Float(asdecimal=True))
    billVpp3 = Column(Float(asdecimal=True))


class Credential(Base, UserMixin):
    __tablename__ = "credentials"

    idcredentials = Column(Integer, primary_key=True)
    username = Column(String(45), nullable=False)
    password = Column(String(45), nullable=False)
    role = Column(Integer, nullable=False)
    idaccounts = Column(ForeignKey("accounts.idaccounts"), nullable=False, index=True)

    def get_id(self):
        return self.idcredentials

    account = relationship("Account")


class Equipment(Base):
    __tablename__ = "equipments"

    idequipments = Column(Integer, primary_key=True)
    eqnames = Column(String(45))
    idaccounts = Column(ForeignKey("accounts.idaccounts"), nullable=False, index=True)
    equipmentstype = Column(String(45), nullable=False)

    account = relationship("Account")


t_powerdata = Table(
    "powerdata",
    metadata,
    Column("timepower", DateTime, nullable=False),
    Column("value", String(45), nullable=False),
    Column(
        "equipments", ForeignKey("equipments.idequipments"), nullable=False, index=True
    ),
)
