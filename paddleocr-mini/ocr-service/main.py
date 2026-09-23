from fastapi import FastAPI

from routes.ocr_routes import router as ocr_router

app = FastAPI(
    title="Mini OCR API",
    description="API para a extração de texto de doocumentos utilizando PaddleOCR",
    version="4.0.0"
)

@app.get("/")
async def root():
    return{
        "messages": "Mini OCR API is running",
        "version": "4.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "ok"
    }

app.include_router(ocr_router)