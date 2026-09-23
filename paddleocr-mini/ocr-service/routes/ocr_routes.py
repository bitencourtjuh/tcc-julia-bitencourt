from fastapi import APIRouter, UploadFile, File, HTTPException

from services.ocr_service import OCRService
from schemas.ocr_response import OCRResponse

router = APIRouter()

ocr_service = OCRService()

@router.post("/ocr", response_model=OCRResponse)
async def proccess_document(
    file: UploadFile = File(...)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename was provided."
        )
    
    allowed_extensions = {
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg"
    }

    extension = file.filename.lower().split(".")[-1]

    if f".{extension}" not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type."
        )   

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="The upload file is empty."
        )
    
    pages = await ocr_service.proccess_document(
        file_content= file_content,
        filename=file.filename
    )

    return OCRResponse(
        filename=file.filename,
        content_type=file.content_type,
        page_count=len(pages),
        pages=pages
    )
