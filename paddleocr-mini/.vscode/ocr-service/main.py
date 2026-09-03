from pathlib import Path
from paddleocr import PaddleOCRClient



def main():

    # Diretório onde o main.py está
    project_directory =  Path(__file__).parent

    pdf_path = project_directory / "Invoice_test.pdf"

    print("PDF path: ", pdf_path)
    print("PDF exists: ", pdf_path.exists())

    if not pdf_path.exists():
        print("Erro, o pdf requerido, não existe no diretório apontado.")
        return

    client = PaddleOCRClient()

       
    try:
        resultado =  client.parse_document(
            file_path = (pdf_path),
            model = "PaddleOCR-VL-1.6",
        )

        print("Job ID: ", resultado.job_id)
        print("Number of pages: ", len(resultado.pages))

        for page in resultado.pages:
            print("\n --------`Pages -------------"),
            print(page.markdown_text),

        client.close()
    finally:
        print("Erro")
        client.close()

if __name__ == "__main__":
    main()