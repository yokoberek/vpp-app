from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from app.config import Config

bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = "users.login"

# -- DATABASE CONFIG
DATABASE_URL = "mysql+mysqldb://theis:RahasiaBanget@10.183.20.101/ems"
engine = create_engine(DATABASE_URL, echo=True)  # Set 'echo' to True for debugging

# Create a session factory
Session = sessionmaker(bind=engine)
session = Session()
# -- END DATABASE CONFIG


def start_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    bcrypt.init_app(app)
    login_manager.init_app(app)

    from app.main.routes import main
    from app.users.routes import users

    app.register_blueprint(main)
    app.register_blueprint(users)

    return app
