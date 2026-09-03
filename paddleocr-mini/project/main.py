from pathlib import Path
from paddleocr import PaddleOCRClient



def main():

    # Diretório onde o main.py está
    project_directory =  Path(__file__).parent

    # Caminho estabelecido do pdf 
    pdf_path = project_directory / "Invoice_test.pdf"

    print("PDF path: ", pdf_path)
    print("PDF exists: ", pdf_path.exists())

    print("----------------------------------")
    print("       Processo Iniciado")
    print("----------------------------------")


    if not pdf_path.exists():
        print("Erro, o pdf requerido, não existe no diretório apontado.")
        return

    

    print("-----------------------------")
    print("     Arquivo encontrado")
    print("-----------------------------")

    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    #Abre conexão com o servidor da AI
    client = PaddleOCRClient()       

    try:
        print("------------------------------")
        print(" Nova requisição de OCR")
        print("------------------------------")

        print("Enviando documento para o PaddleOCR...")

        resultado =  client.parse_document(
            file_path = (pdf_path),
            model = "PaddleOCR-VL-1.6",
        )

        print("------------------------------------")
        print("     Processamento Conclúído")
        print("------------------------------------")

        
        print("Analisando documento...")


        print("Job ID: ", resultado.job_id)
        print("Number of pages: ", len(resultado.pages))

        for index, page in enumerate(resultado.pages, start=1):

            output_file = output_dir / f"page-{index}.md"

            output_file.write_text(
                page.markdown_text,
                encoding="utf8"
            )

            print(f"\n página {index} salva em:")
            print(output_file)

        client.close()

    except Exception as error:

        error_type= TypeError.__name__
        error_message= str(error)

        print("Descrição do erro:" \
        f"\nTipo de erro: {error_type}" \
        f"\nMensagem: {error_message}")

        print("Fechando conexão com o cliente PaddleOCR ...")

        client.close()
        
    finally:
        client.close()

if __name__ == "__main__":
    main()