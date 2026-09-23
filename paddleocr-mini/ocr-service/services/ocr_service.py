from pathlib import Path
import os
import tempfile

from paddleocr import PaddleOCRClient

class OCRService:

    def __init__(self):
        self.client = PaddleOCRClient()

    async def proccess_document(
                self,
                file_content: bytes,
                filename: str
        ):
            temporary_file_path = None

            try:
                file_extension = Path(filename).suffix.lower()

                with tempfile.NamedTemporaryFile(
                    delete=False,
                    suffix=file_extension
                ) as temporary_file:
                    
                    temporary_file.write(file_content)

                    temporary_file_path = temporary_file.name

                print(f"Temporary file: {temporary_file_path}")

                resultado = self.client.parse_document(
                    file_path = temporary_file_path,
                    model="PaddleOCR-VL-1.6"
                )

                pages = []

                for page_number, page in enumerate(
                    resultado.pages,
                      start=1
                      ):
                    pages.append({
                        "page_number": page_number,
                        "text": page.markdown_text
                    })

                return pages
            finally:

                if(
                    temporary_file_path
                    and os.path.exists(temporary_file_path)
                ):
                    os.remove(temporary_file_path)

                    print("Temporary file removed.")