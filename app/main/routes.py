from app import session
from flask import Blueprint, jsonify, render_template, Response
from flask_login import login_required
from flask_restful import Resource, Api

import json, time
from datetime import datetime, timedelta

main = Blueprint("main", __name__, template_folder="templates")
api = Api(main)


@main.route("/")
@login_required
def index():
    return render_template("main/index.html")


class EquipmentResource(Resource):
    @login_required
    def get(self):
        # Plot 1, 2, 3
        obj_data_all = session.execute(
            "SELECT date, v10, v11, v12, v13 FROM emsdata ORDER BY date DESC"
        ).fetchmany(2000)

        data_v10 = [[item[0], item[1]] for item in obj_data_all]
        data_v11 = [[item[0], item[2]] for item in obj_data_all]
        data_v12 = [[item[0], item[3]] for item in obj_data_all]
        data_v13 = [[item[0], item[4]] for item in obj_data_all]

        context = {
            "data_v10": data_v10,
            "data_v11": data_v11,
            "data_v12": data_v12,
            "data_v13": data_v13,
        }
        return jsonify(context)


class BillResource(Resource):
    @login_required
    def get(self):
        # Plot 4
        obj_data = session.execute(
            "SELECT daytime, ROUND(billVpp1,2), ROUND(billVpp2,2), ROUND(billVpp3,2) FROM electrbill ORDER BY daytime DESC"
        ).fetchmany(2000)

        bill_vpp1 = [[item[0], item[1]] for item in obj_data]
        bill_vpp2 = [[item[0], item[2]] for item in obj_data]
        bill_vpp3 = [[item[0], item[3]] for item in obj_data]

        context = {
            "bill_vpp1": bill_vpp1,
            "bill_vpp2": bill_vpp2,
            "bill_vpp3": bill_vpp3,
        }
        return jsonify(context)


# Register the resource with the API
api.add_resource(EquipmentResource, "/api/equipment/")
api.add_resource(BillResource, "/api/bill/")


@main.route("/embed")
@login_required
def embed():
    return render_template("main/embed.html")


@main.route("/data-streaming/vpp1")
def chart_vpp1():
    obj_data_all = session.execute(
        "SELECT date, v10, v11 FROM emsdata ORDER BY date DESC"
    ).fetchmany(20000)
    date = [item[0] for item in obj_data_all]
    data_v10 = [item[1] for item in obj_data_all]
    data_v11 = [item[2] for item in obj_data_all]

    def process_data(data_list):
        # Memilih data dari indeks 10 terakhir
        selected_data = data_list[:10]

        # Memutar urutan data
        reversed_data = selected_data[::-1]

        # Mengembalikan data hasil proses
        return reversed_data

    processed_date = process_data(date)
    processed_v10 = process_data(data_v10)
    processed_v11 = process_data(data_v11)

    def generate_realtime_data():
        for i in range(len(processed_date)):
            json_data = json.dumps(
                {
                    "time": processed_date[i].strftime("%H:%M:%S"),
                    "value_v10": processed_v10[i],
                    "value_v11": processed_v11[i],
                }
            )
            yield f"data:{json_data}\n\n"
            time.sleep(2)


    return Response(generate_realtime_data(), mimetype="text/event-stream")


@main.route("/data-streaming/vpp2")
def chart_vpp2():
    obj_data_all = session.execute(
        "SELECT date, v12 FROM emsdata ORDER BY date DESC"
    ).fetchmany(20000)
    date = [item[0] for item in obj_data_all]
    data_v12 = [item[1] for item in obj_data_all]

    def process_data(data_list):
        # Memilih data dari indeks 10 terakhir
        selected_data = data_list[:10]

        # Memutar urutan data
        reversed_data = selected_data[::-1]

        # Mengembalikan data hasil proses
        return reversed_data

    processed_date = process_data(date)
    processed_v12 = process_data(data_v12)

    def generate_realtime_data():
        for i in range(len(processed_date)):
            json_data = json.dumps(
                {
                    "time": processed_date[i].strftime("%H:%M:%S"),
                    "value_v12": processed_v12[i],
                }
            )
            yield f"data:{json_data}\n\n"
            time.sleep(2)

    return Response(generate_realtime_data(), mimetype="text/event-stream")

@main.route("/data-streaming/vpp3")
def chart_vpp3():
    obj_data_all = session.execute(
        "SELECT date, v13 FROM emsdata ORDER BY date DESC"
    ).fetchmany(20000)
    date = [item[0] for item in obj_data_all]
    data_v13 = [item[1] for item in obj_data_all]

    def process_data(data_list):
        # Memilih data dari indeks 10 terakhir
        selected_data = data_list[:10]

        # Memutar urutan data
        reversed_data = selected_data[::-1]

        # Mengembalikan data hasil proses
        return reversed_data

    processed_date = process_data(date)
    processed_v13 = process_data(data_v13)

    def generate_realtime_data():
        for i in range(len(processed_date)):
            json_data = json.dumps(
                {
                    "time": processed_date[i].strftime("%H:%M:%S"),
                    "value_v13": processed_v13[i],
                }
            )
            yield f"data:{json_data}\n\n"
            time.sleep(2)

    return Response(generate_realtime_data(), mimetype="text/event-stream")


@main.route("/data-streaming/billing")
def chart_billing():
    obj_data_all = session.execute(
        "SELECT daytime, ROUND(billVpp1,2), ROUND(billVpp2,2), ROUND(billVpp3,2) FROM electrbill ORDER BY daytime DESC"
    ).fetchmany(20000)
    date = [item[0] for item in obj_data_all]
    data_vpp1 = [item[1] for item in obj_data_all]
    data_vpp2 = [item[2] for item in obj_data_all]
    data_vpp3 = [item[3] for item in obj_data_all]

    def process_data(data_list):
        # Memilih data dari indeks 10 terakhir
        selected_data = data_list[:10]

        # Memutar urutan data
        reversed_data = selected_data[::-1]

        # Mengembalikan data hasil proses
        return reversed_data

    processed_date = process_data(date)
    processed_vpp1 = process_data(data_vpp1)
    processed_vpp2 = process_data(data_vpp2)
    processed_vpp3 = process_data(data_vpp3)

    def generate_realtime_data():
        for i in range(len(processed_date)):
            json_data = json.dumps(
                {
                    "time": processed_date[i].strftime("%H:%M:%S"),
                    "bill_vpp1": processed_vpp1[i],
                    "bill_vpp2": processed_vpp2[i],
                    "bill_vpp3": processed_vpp3[i],
                }
            )
            yield f"data:{json_data}\n\n"
            time.sleep(2)


    return Response(generate_realtime_data(), mimetype="text/event-stream")