from pydantic import BaseModel
from typing import List

class OCRPage(BaseModel):
    page_number: int
    text: str

class OCRResponse(BaseModel):
    filename: str
    content_type: str
    page_count: int
    pages: List[OCRPage]