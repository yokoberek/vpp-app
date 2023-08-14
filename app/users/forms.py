from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    username = StringField("Your username ", validators=[DataRequired()])
    password = PasswordField("Your password ", validators=[DataRequired()])
    remember = BooleanField("Remember me", default=False)
    submit = SubmitField("Login to your account")
