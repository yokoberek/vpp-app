from app import session
from flask import render_template, Blueprint, jsonify
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
    def get(self):
        with session as new_session:
            try:
                # Menggunakan session() untuk membuat instance session baru
                query = f"SELECT date, v10, v11, v12, v13 FROM emsdata_new WHERE date >= NOW() - INTERVAL 6 DAY ORDER BY date DESC"
                obj_data_all = new_session.execute(query).fetchall()

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

                context = {
                    "time": processed_date,
                    "value_v10": processed_v10,
                    "value_v11": processed_v11,
                    "value_v12": processed_v12,
                    "value_v13": processed_v13,
                }

                return jsonify(context)

            except Exception as e:
                new_session.rollback()
                raise e


class BillResource(Resource):
    @login_required
    def get(self):
        try:
            # Membuat query SQL untuk mengambil data tagihan dari database
            query = "SELECT daytime, ROUND(billVpp1,2), ROUND(billVpp2,2), ROUND(billVpp3,2) FROM electrbill WHERE daytime >= NOW() - INTERVAL 6 DAY ORDER BY daytime DESC"
            obj_data_all = session.execute(query).fetchall()
            print(f"Query executed: {query}")

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
                "bill_date": processed_date,
                "bill_vpp1": processed_bill_vpp1,
                "bill_vpp2": processed_bill_vpp2,
                "bill_vpp3": processed_bill_vpp3,
            }

            return jsonify(context)

        except Exception as e:
            # Handle exceptions yang mungkin terjadi selama query atau proses data
            session.rollback()
            raise e

        finally:
            # Pastikan sesi ditutup setelah request selesai
            session.close()


# Register the resource with the API
api.add_resource(EquipmentResource, "/api/equipment/")
api.add_resource(BillResource, "/api/billing/")


@main.route("/embed")
@login_required
def embed():
    # Template ini akan di-render dan dikirim sebagai respons ke klien (browser) dan digunakan didalam iframe.
    return render_template("main/embed.html")
