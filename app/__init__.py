from flask import Flask
from flask_login import LoginManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_assets import Bundle, Environment
from app.config import Config

assets = Environment()
login_manager = LoginManager()
login_manager.login_view = "users.login"

# -- DATABASE CONFIG
DATABASE_URL = "mysql+mysqldb://theis:RahasiaBanget@10.183.20.101/ems"
engine = create_engine(DATABASE_URL, echo=True)  # Set 'echo' to True for debugging

# Create a session factory
Session = sessionmaker(bind=engine)
session = Session()
# -- END DATABASE CONFIG


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    login_manager.init_app(app)
    assets.init_app(app)

    with app.app_context():
        css = Bundle("src/main.css", output="dist/main.css")
        assets.register("css", css)
        css.build()

    from app.main.routes import main
    from app.users.routes import users

    app.register_blueprint(main)
    app.register_blueprint(users)

    return app
