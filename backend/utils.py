from PIL import Image
import os

def save_image_as_pdf(image_path, house_no, doc_type):
    img = Image.open(image_path).convert("RGB")
    folder = f'documents/House{house_no}/{doc_type}'
    os.makedirs(folder, exist_ok=True)
    pdf_path = os.path.join(folder, f'House{house_no}_{doc_type}.pdf')
    img.save(pdf_path, "PDF", resolution=100.0)
    return pdf_path

def list_documents():
    docs = {}
    base = "documents"
    if not os.path.exists(base):
        return docs
    for house in os.listdir(base):
        house_path = os.path.join(base, house)
        docs[house] = []
        for dtype in os.listdir(house_path):
            pdf = os.path.join(house, dtype, f"{house}_{dtype}.pdf")
            docs[house].append({"type": dtype, "pdf": pdf})
    return docs

# app.py
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from utils import save_image_as_pdf, list_documents
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'documents'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_document():
    house_no = request.form['house']
    doc_type = request.form['doc_type']
    file = request.files['file']

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('temp', filename)
        os.makedirs('temp', exist_ok=True)
        file.save(filepath)

        pdf_path = save_image_as_pdf(filepath, house_no, doc_type)
        os.remove(filepath)
        return jsonify({'status': 'success', 'pdf': pdf_path}), 200
    return jsonify({'error': 'No file uploaded'}), 400

@app.route('/list', methods=['GET'])
def get_documents():
    return jsonify(list_documents()), 200

@app.route('/documents/<path:path>', methods=['GET'])
def serve_doc(path):
    return send_from_directory('documents', path)

if __name__ == '__main__':
    app.run(debug=True)
