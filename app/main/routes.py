from flask import render_template, Blueprint
from flask_login import login_required
from app import session
import json

main = Blueprint("main", __name__, template_folder="templates")


@main.route("/")
@login_required
def index():
    # Plot 1
    obj_data1 = session.execute(
        "SELECT date, v10, v11 FROM emsdata ORDER BY date DESC LIMIT 500"
    ).fetchall()
    data_v10 = [[int(item[0].timestamp()) * 1000, item[1]] for item in obj_data1]
    data_v11 = [[int(item[0].timestamp()) * 1000, item[2]] for item in obj_data1]

    # Plot 2
    obj_data2 = session.execute(
        "SELECT date, v12 FROM emsdata ORDER BY date DESC LIMIT 500"
    ).fetchall()
    data_v12 = [[int(item[0].timestamp()) * 1000, item[1]] for item in obj_data2]

    # Plot 3
    obj_data3 = session.execute(
        "SELECT date, v13 FROM emsdata ORDER BY date DESC LIMIT 500"
    ).fetchall()
    data_v13 = [[int(item[0].timestamp()) * 1000, item[1]] for item in obj_data3]

    # Plot 4
    obj_data4 = session.execute(
        "SELECT daytime, billVpp1, billVpp2, billVpp3 FROM electrbill ORDER BY daytime DESC LIMIT 500"
    ).fetchall()
    bill_vpp1 = [[int(item[0].timestamp()) * 1000, item[1]] for item in obj_data4]
    bill_vpp2 = [[int(item[0].timestamp()) * 1000, item[2]] for item in obj_data4]
    bill_vpp3 = [[int(item[0].timestamp()) * 1000, item[3]] for item in obj_data4]

    context = {
        "data_v10": data_v10,
        "data_v11": data_v11,
        "data_v12": data_v12,
        "data_v13": data_v13,
        "bill_vpp1": bill_vpp1,
        "bill_vpp2": bill_vpp2,
        "bill_vpp3": bill_vpp3,
    }

    return render_template("main/index.html", **context)
