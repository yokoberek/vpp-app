from flask import render_template, redirect, request, url_for, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from app import session
from app.users.forms import LoginForm
from app.users.models import Credential

# Membuat blueprint "users" untuk mengelola halaman terkait pengguna
users = Blueprint("users", __name__, template_folder="templates")

# Rute untuk halaman login (sign-in) dengan metode GET dan POST
@users.route("/sign-in", methods=["GET", "POST"])
def login():
    # Redirect ke halaman utama jika pengguna sudah terautentikasi
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))
    form = LoginForm()
    if form.validate_on_submit():
        # Mencari pengguna berdasarkan nama pengguna dari basis data
        user = (
            session.query(Credential)
            .filter(Credential.username == form.username.data)
            .first()
        )
        # Mengecek kecocokan kata sandi dan mengautentikasi pengguna
        if user and user.password:  #TODO: Disarankan untuk menggunakan bcrypt.check_password_hash()
            login_user(user)
            next_page = request.args.get("next")
            return redirect(next_page) if next_page else redirect(url_for("main.index"))
        else:
            print("Gagal login ke dashboard, hubungi admin")
    return render_template("users/login.html", form=form)

# Rute untuk logout (sign-out) pengguna
@users.route("/sign-out")
def logout():
    logout_user()
    return redirect(url_for("users.login"))
