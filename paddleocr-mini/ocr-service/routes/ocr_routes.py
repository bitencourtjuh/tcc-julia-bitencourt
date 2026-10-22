from fastapi import APIRouter, UploadFile, File, HTTPException

from services.ocr_service import OCRService
from schemas.ocr_response import OCRResponse

import logging

from paddleocr import (
    NetworkError,
    RequestTimeoutError,
    PollTimeoutError,
    ServiceUnavailableError,
    RateLimitError,
    PaddleOCRAPIError,
)

router = APIRouter()

logger = logging.getLogger(__name__)

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
    
    
    try:
        pages = await ocr_service.proccess_document(
            file_content=file_content,
            filename=file.filename
        )

    except (NetworkError, ServiceUnavailableError) as exc:
        logger.exception("Remote PaddleOCR service unavailable")

        raise HTTPException(
            status_code=503,
            detail="Serviço OCR temporariamente indisponível."
        ) from exc

    except (RequestTimeoutError, PollTimeoutError) as exc:
        logger.exception("Remote PaddleOCR request timed out")

        raise HTTPException(
            status_code=504,
            detail="Tempo limite excedido no processamento OCR."
        ) from exc

    except RateLimitError as exc:
        logger.warning("Remote PaddleOCR quota or rate limit reached")

        raise HTTPException(
            status_code=503,
            detail="Limite de utilização do serviço OCR atingido."
        ) from exc

    except PaddleOCRAPIError as exc:
        logger.exception("Remote PaddleOCR API failed")

        raise HTTPException(
            status_code=502,
            detail="O serviço OCR retornou uma falha."
        ) from exc


    return OCRResponse(
        filename=file.filename,
        content_type=file.content_type,
        page_count=len(pages),
        pages=pages
    )
