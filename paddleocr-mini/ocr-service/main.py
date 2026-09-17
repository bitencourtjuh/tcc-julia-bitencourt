from fastapi import FastAPI, UploadFile, File
from paddleocr import PaddleOCRClient
import tempfile
from pathlib import Path

app = FastAPI()

client = PaddleOCRClient()

@app.post("/ocr")

async def process_document(file: UploadFile = File(...)):

    # Arquivo temporário
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    )as temporary_file:
        file_content = await file.read()

        temporary_file.write(file_content)

        temporary_file_path = temporary_file.name

    try:
        
        # Envio do pdf para o paddleOCR
        resultado = client.parse_document(
            file_path = temporary_file_path,
            model="PaddleOCR-VL-1.6",
        )

        pages=[]

        for index, page in enumerate(resultado.pages, start=1):
            pages.append({
                "page": index,
                "markdown": page.markdown_text
            })
        
        return {
            "jobId": resultado.job_id,
            "pages": pages
        }
    
    finally:

        Path(temporary_file_path).unlink(
            missing_ok=True
        )
