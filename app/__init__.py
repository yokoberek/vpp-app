from flask import Flask
from flask_caching import Cache
from flask_login import LoginManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_assets import Bundle, Environment
from app.config import Config

assets = Environment()
login_manager = LoginManager()
login_manager.login_view = "users.login"

# -- DATABASE CONFIG
DATABASE_URL = "mysql+mysqldb://theis:RahasiaBanget@10.183.20.108/ems"
engine = create_engine(DATABASE_URL)  # Set 'echo' to True for debugging

cache = Cache()

# Create a session factory
Session = sessionmaker(bind=engine)
session = Session()
# -- END DATABASE CONFIG


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    assets.init_app(app)
    login_manager.init_app(app)
    cache.init_app(app)

    with app.app_context():
        css = Bundle("css/src/main.css", output="css/dist/main.css")
        assets.register("css", css)
        css.build()

    from app.main.routes import main
    from app.users.routes import users

    app.register_blueprint(main)
    app.register_blueprint(users)

    return app
