from flask import render_template, redirect, request, url_for, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from app import session
from app.users.forms import LoginForm
from app.users.models import Credential

users = Blueprint("users", __name__, template_folder="templates")


@users.route("/sign-in", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))
    form = LoginForm()
    if form.validate_on_submit():
        user = (
            session.query(Credential)
            .filter(Credential.username == form.username.data)
            .first()
        )
        # if user and bcrypt.check_password_hash(user.password, form.password.data):
        if user and user.password:
            login_user(user)
            next_page = request.args.get("next")
            return redirect(next_page) if next_page else redirect(url_for("main.index"))
        else:
            print("Gagal login ke dashboard, hubungi admin")
    return render_template("users/login.html", form=form)


@users.route("/sign-out")
def logout():
    logout_user()
    return redirect(url_for("users.login"))
