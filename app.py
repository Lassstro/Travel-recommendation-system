from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
app = Flask(__name__)

dia_diem = ["Bãi biển Mỹ Khê", "Cầu Rồng", "Ngũ Hành Sơn", "Bà Nà Hills", "Chùa Linh Ứng", "Cầu Thuận Phước", "Bãi biển Non Nước", "Sông Hàn", "Làng Đá Mỹ Đức", "Công viên Châu Á", "Bảo tàng Chăm", "Bãi biển An Bàng", "Công viên Biển Đông", "Vinpearl Land Nam Hội An", "Quảng trường Trung tâm", "Bảo tàng Đà Nẵng", "Công viên 29/3", "Khu du lịch sinh thái Cồn Ngọc", "Bãi biển Đá Ông Địa", "Hội An"]

# Load mô hình đã được huấn luyện
loaded_model = joblib.load('Models/model.joblib')
loaded_encoder = joblib.load('Models/encoder.joblib')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    results = pd.DataFrame(columns=["Địa hình","Mức thu nhập", "Số lượng người", "Thời gian", "Mục đích du lịch","Địa điểm", "Đánh giá"])
    # Dự đoán trên dữ liệu mới
    for i in dia_diem:
        new_data = pd.DataFrame({
            'Địa hình': [request.json.get('terrain')],
            'Mức thu nhập': [request.json.get('income')],
            'Số lượng người': [request.json.get('numberOfPeople')],
            'Thời gian': [request.json.get('time')],
            'Mục đích du lịch': [request.json.get('purpose')],
            'Địa điểm': [i],
        })

        # Mã hóa dữ liệu mới
        new_data_encoded = loaded_encoder.transform(new_data)

        # Dự đoán trên dữ liệu mới
        new_predictions = loaded_model.predict(new_data_encoded)

        # In dự đoán
        new_data['Đánh giá'] = new_predictions[0]
        results = pd.concat([results, new_data], ignore_index=True)
    results = results.sort_values(by='Đánh giá', ascending=False)
    return jsonify(results.head(3).reset_index().to_dict())

if __name__ == '__main__':
    app.run(debug=True)
