from app import session
from flask import render_template, Blueprint, jsonify
from flask_login import login_required
from flask_restful import Resource, Api
import json

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

        date = [item[0] for item in obj_data_all]
        data_v10 = [item[1] for item in obj_data_all]
        data_v11 = [item[2] for item in obj_data_all]
        data_v12 = [item[4] for item in obj_data_all]
        data_v13 = [item[3] for item in obj_data_all]

        def process_data(data_list):
            # Memutar urutan data & Mengembalikan data hasil proses
            return data_list[::-1]

        processed_date = process_data(date)
        processed_v10 = process_data(data_v10)
        processed_v11 = process_data(data_v11)
        processed_v12 = process_data(data_v12)
        processed_v13 = process_data(data_v13)

        context = {
            "time": processed_date,
            "value_v10": processed_v10,
            "value_v11": processed_v11,
            "value_v12": processed_v12,
            "value_v13": processed_v13,
        }

        return jsonify(context)


class BillResource(Resource):
    @login_required
    def get(self):
        # Plot 4
        obj_data_all = session.execute(
            "SELECT daytime, ROUND(billVpp1,2), ROUND(billVpp2,2), ROUND(billVpp3,2) FROM electrbill ORDER BY daytime DESC"
        ).fetchmany(2000)

        date = [item[0] for item in obj_data_all]
        bill_vpp1 = [item[1] for item in obj_data_all]
        bill_vpp2 = [item[2] for item in obj_data_all]
        bill_vpp3 = [item[3] for item in obj_data_all]

        def process_data(data_list):
            # Memutar urutan data & Mengembalikan data hasil proses
            return data_list[::-1]

        processed_date = process_data(date)
        processed_bill_vpp1 = process_data(bill_vpp1)
        processed_bill_vpp2 = process_data(bill_vpp2)
        processed_bill_vpp3 = process_data(bill_vpp3)

        context = {
            "time": processed_date,
            "bill_vpp1": processed_bill_vpp1,
            "bill_vpp2": processed_bill_vpp2,
            "bill_vpp3": processed_bill_vpp3,
        }

        return jsonify(context)



# Register the resource with the API
api.add_resource(EquipmentResource, "/api/equipment/")
api.add_resource(BillResource, "/api/billing/")


@main.route("/embed")
@login_required
def embed():
    return render_template("main/embed.html")
