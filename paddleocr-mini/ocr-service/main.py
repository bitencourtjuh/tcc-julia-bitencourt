from fastapi import FastAPI, UploadFile, File, HTTPException
import os
from paddleocr import PaddleOCRClient
import tempfile
import traceback

from pathlib import Path

app = FastAPI(
    title="Mini OCR API",
    description="Uma API para extrair textos de documentos via PaddleOCR",
    version="3.0.0"
)

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


        # Leitura do Arquivo

        file_content = await file.read()

        if not file_content:
            raise HTTPException(
                status_code=400,
                details="The upload file is empty."
            )

        print(f"File size: {len(file_content)} bytes")

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension
        )as temporary_file:
            temporary_file.write(file_content)
            temporary_file_path = temporary_file.name

        print(f"Temporary file createad: {temporary_file_path}")


        # Criação do Cliente PaddleOCR

        client = PaddleOCRClient()

        print("PaddleOCR client created")

        resultado = client.parse_document(
            file_path=temporary_file_path,
            model="PaddleOCR-VL-1.6"
        )

        print("Document processed by PaddleOCR")

        #Conversão em JSON

        pages = []

        for page_number, page in enumerate(resultado.pages, start=1):
            pages.append({
                "page_number": page_number,
                "text": page.markdown_text
            })

        # Retorno

        return {
            "filename": file.filename,
            "contet_type": file.content_type,
            "page_count": len(pages),
            "pages": pages
        } 
    except HTTPException: 
        raise
    except Exception as error:
        print("\n" + "=" * 60)
        print("ERROR WHILE PROCESS THE DOCUMENT")
        print("=" * 60)
        print(f"Error type: {type(error).__name__}")
        print(f"Error message: {error}")
        traceback.print_exc()
        print("=" * 60 + "\n")

        raise HTTPException(
            status_code=500,
            detail={
                    "error": type(error).__name__,
                    "message": str(error)
            }
        )

    finally:
        # Limpando temp file

        if(
            temporary_file_path is not None
            and os.path.exists(temporary_file_path)
        ):
            os.remove(temporary_file_path)
            print("Temporary file removed")

        if client is not None:
            try:
                client.close()
                print("PaddleOCR client closed")
            except Exception as close_error:
                print(f"Cloud not close PaddleOCR client: {close_error}") 