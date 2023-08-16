from app import session
from flask import render_template, Blueprint, jsonify
from flask_login import login_required
from flask_restful import Resource, Api

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
        ).fetchmany(50000)

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
        ).fetchmany(50000)

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
