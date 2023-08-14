from flask import render_template, Blueprint
from flask_login import login_required
from app import session

main = Blueprint("main", __name__, template_folder="templates")


@main.route("/")
@login_required
def index():
    # Plot 1 [emsdata(v10, v11)]
    time_plot = session.execute("SELECT date FROM emsdata LIMIT 50")
    plot_time = [value[0].strftime("%m/%d/%Y, %H:%M:%S") for value in time_plot]
    array_v10 = session.execute("SELECT v10 FROM emsdata LIMIT 50")
    data_v10 = [value[0] for value in array_v10]
    array_v11 = session.execute("SELECT v11 FROM emsdata LIMIT 50")
    data_v11 = [value[0] for value in array_v11]
    # Plot 2 [emsdata(v12)]
    array_v12 = session.execute("SELECT v12 FROM emsdata LIMIT 50")
    data_v12 = [value[0] for value in array_v12]
    # Plot 3 [emsdata(v13)]
    array_v13 = session.execute("SELECT v13 FROM emsdata LIMIT 50")
    data_v13 = [value[0] for value in array_v13]
    # Plot 4
    time_bill = session.execute("SELECT daytime FROM electrbill LIMIT 50")
    bill_time = [value[0].strftime("%m/%d/%Y, %H:%M:%S") for value in time_bill]
    array_bill1 = session.execute("SELECT billVpp1 FROM electrbill LIMIT 50")
    bill_vpp1 = [value[0] for value in array_bill1]
    array_bill2 = session.execute("SELECT billVpp2 FROM electrbill LIMIT 50")
    bill_vpp2 = [value[0] for value in array_bill2]
    array_bill3 = session.execute("SELECT billVpp3 FROM electrbill LIMIT 50")
    bill_vpp3 = [value[0] for value in array_bill3]

    return render_template(
        "main/index.html",
        plot_time=plot_time,
        data_v10=data_v10,
        data_v11=data_v11,
        data_v12=data_v12,
        data_v13=data_v13,
        bill_time=bill_time,
        bill_vpp1=bill_vpp1,
        bill_vpp2=bill_vpp2,
        bill_vpp3=bill_vpp3,
    )
