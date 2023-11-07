from app import session, cache
from flask import render_template, Blueprint, jsonify, request
from flask_login import login_required
from flask_restful import Resource, Api

# Membuat blueprint bernama "main" dengan nama modul "__name__"
# dan menentukan folder tempat template HTML ditempatkan.
main = Blueprint("main", __name__, template_folder="templates")

# Membuat objek API berdasarkan blueprint "main"
api = Api(main)


@main.route("/")
@login_required
def index():
    return render_template("main/index.html")


def process_data(data_list):
    # Memutar urutan data & Mengembalikan data hasil proses
    return data_list[::-1]


class EquipmentResource(Resource):
    @login_required
    @cache.cached(timeout=1800, query_string=True)
    def get(self):
        # Mengambil parameter dari query string
        interval_type = request.args.get("interval_type", default="DAY", type=str)
        interval_value = request.args.get("interval_value", default=6, type=int)
        fields = request.args.get("fields", type=str)

        # Memproses permintaan berdasarkan nilai 'fields'
        if "v10,v11" == fields:
            # Membuat query SQL untuk mengambil data v10 dan v11 dari database
            query = f"SELECT date, {fields} FROM emsdata_new WHERE date >= NOW() - INTERVAL {interval_value} {interval_type} ORDER BY date DESC"
            obj_data_all = session.execute(query).fetchall()

            # Memisahkan tanggal, v10, dan v11 dari hasil query
            date = [item[0] for item in obj_data_all]
            data_v10 = [item[1] for item in obj_data_all]
            data_v11 = [item[2] for item in obj_data_all]

            # Memproses data tanggal, v10, dan v11
            processed_date = process_data(date)
            processed_v10 = process_data(data_v10)
            processed_v11 = process_data(data_v11)

            # Membuat konteks JSON untuk v10 dan v11 yang telah diproses
            context = {
                "time": processed_date,
                "value_v10": processed_v10,
                "value_v11": processed_v11,
            }

            # Mengembalikan hasil dalam bentuk JSON
            return jsonify(context)

        elif "v12" == fields:
            # Proses serupa seperti di atas untuk v12
            query = f"SELECT date, {fields} FROM emsdata_new WHERE date >= NOW() - INTERVAL {interval_value} {interval_type} ORDER BY date DESC"
            obj_data_all = session.execute(query).fetchall()

            date = [item[0] for item in obj_data_all]
            data_v12 = [item[1] for item in obj_data_all]

            processed_date = process_data(date)
            processed_v12 = process_data(data_v12)

            context = {
                "time": processed_date,
                "value_v12": processed_v12,
            }

            return jsonify(context)

        elif "v13" == fields:
            # Proses serupa seperti di atas untuk v13
            query = f"SELECT date, {fields} FROM emsdata_new WHERE date >= NOW() - INTERVAL {interval_value} {interval_type} ORDER BY date DESC"
            obj_data_all = session.execute(query).fetchall()

            date = [item[0] for item in obj_data_all]
            data_v13 = [item[1] for item in obj_data_all]

            processed_date = process_data(date)
            processed_v13 = process_data(data_v13)

            context = {
                "time": processed_date,
                "value_v13": processed_v13,
            }

            return jsonify(context)

        else:
            # Proses serupa seperti di atas untuk semua nilai fields
            query = f"SELECT date, v10, v11, v12, v13 FROM emsdata_new WHERE date >= NOW() - INTERVAL {interval_value} {interval_type} ORDER BY date DESC"
            # query = f"SELECT max(date), max(v10), max(v11), max(v12), max(v13) FROM emsdata_new e group by SUBSTRING_INDEX(date, ':', 2) having date(max(date)) = date(now())"
            obj_data_all = session.execute(query).fetchall()

            date = [item[0] for item in obj_data_all]
            data_v10 = [item[1] for item in obj_data_all]
            data_v11 = [item[2] for item in obj_data_all]
            data_v12 = [item[4] for item in obj_data_all]
            data_v13 = [item[3] for item in obj_data_all]

            processed_date = process_data(date)
            processed_v10 = process_data(data_v10)
            processed_v11 = process_data(data_v11)
            processed_v12 = process_data(data_v12)
            processed_v13 = process_data(data_v13)

            # Membuat konteks JSON untuk semua nilai v10, v11, v12, v13 yang telah diproses
            context = {
                "time": processed_date,
                "value_v10": processed_v10,
                "value_v11": processed_v11,
                "value_v12": processed_v12,
                "value_v13": processed_v13,
            }

            # Mengembalikan hasil dalam bentuk JSON
            return jsonify(context)


class BillResource(Resource):
    @login_required
    @cache.cached(timeout=1800, query_string=True)
    def get(self):
        # Mengambil parameter dari query string
        interval_type = request.args.get("interval_type", default="HOUR", type=str)
        interval_value = request.args.get("interval_value", default=6, type=int)

        # Membuat query SQL untuk mengambil data tagihan dari database
        query = f"SELECT daytime, ROUND(billVpp1,2), ROUND(billVpp2,2), ROUND(billVpp3,2) FROM electrbill WHERE daytime >= NOW() - INTERVAL {interval_value} {interval_type} ORDER BY daytime DESC"
        obj_data_all = session.execute(query).fetchall()

        # Memisahkan tanggal dan data tagihan untuk tiga nilai Vpp dari hasil query
        date = [item[0] for item in obj_data_all]
        bill_vpp1 = [item[1] for item in obj_data_all]
        bill_vpp2 = [item[2] for item in obj_data_all]
        bill_vpp3 = [item[3] for item in obj_data_all]

        # Memproses data tanggal dan tagihan untuk tiga nilai Vpp
        processed_date = process_data(date)
        processed_bill_vpp1 = process_data(bill_vpp1)
        processed_bill_vpp2 = process_data(bill_vpp2)
        processed_bill_vpp3 = process_data(bill_vpp3)

        # Membuat konteks JSON untuk tiga nilai tagihan Vpp yang telah diproses
        context = {
            "time": processed_date,
            "bill_vpp1": processed_bill_vpp1,
            "bill_vpp2": processed_bill_vpp2,
            "bill_vpp3": processed_bill_vpp3,
        }

        # Mengembalikan hasil dalam bentuk JSON
        return jsonify(context)


class SavingsResource(Resource):
    @login_required
    def get(self):
        obj_data_all = session.execute("CALL getSavingsVPP()").fetchall()

        for item in obj_data_all:
            s1 = item[0]
            s2 = item[1]
            s3 = item[2]

        context = {"svvp1": s1, "svvp2": s2, "svvp3": s3}

        return jsonify(context)


# Register the resource with the API
api.add_resource(EquipmentResource, "/api/equipment/")
api.add_resource(BillResource, "/api/billing/")
api.add_resource(SavingsResource, "/api/savings/")


@main.route("/embed")
@login_required
def embed():
    # Template ini akan di-render dan dikirim sebagai respons ke klien (browser) dan digunakan didalam iframe.
    return render_template("main/embed.html")


@main.route("/new")
@login_required
def new():
    return render_template("main/new-bak.html")
