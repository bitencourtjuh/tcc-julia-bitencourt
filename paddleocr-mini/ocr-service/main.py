from fastapi import FastAPI, UploadFile, File, HTTPException
from paddleocr import PaddleOCRClient
import tempfile
import traceback

from pathlib import Path

app = FastAPI(
    title="Mini OCR API",
    description="Uma API para extrair textos de documentos via PaddleOCR",
    version="3.0.0"
)

client = PaddleOCRClient()

@app.get("/")
async def root():
    return{
        "message": "Mini API is running",
        "version": "3.0.0"
    }

@app.get("/health")
async def health_check():
    return{
        "statuts":"ok"
    }

@app.post("/ocr")
async def process_document(file: UploadFile = File(...)):
    
    temporary_file_path = None
    client = None

    # Arquivo temporário
#    with tempfile.NamedTemporaryFile(
#        delete=False,
#        suffix=".pdf"
#    )as temporary_file:
#        file_content = await file.read()
#
#       temporary_file.write(file_content)
#
#        temporary_file_path = temporary_file.name

    try:
        
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No filename was provided."
            )

        print(f"Received file: {file.filename}")
        print(f"Content type: {file.content_type}")

        allowed_extensions = {".pdf", ".png", ".jpeg", ".jpg"}

        file_extension = Path(file.filename).suffix.lower()

        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=("Unsupported file type. "
                        "Use pdf, jpg, jpeg, png")
            )
        
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
