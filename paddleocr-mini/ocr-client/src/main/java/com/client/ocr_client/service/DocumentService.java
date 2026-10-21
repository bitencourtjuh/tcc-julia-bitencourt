package com.client.ocr_client.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.client.ocr_client.dto.DadosExtraidos;
import com.client.ocr_client.dto.DocumentProcessResponse;
import com.client.ocr_client.dto.OCRPage;
import com.client.ocr_client.dto.OCRResponse;

@Service
public class DocumentService {

    private final OcrClient ocrClient;

    public DocumentService(OcrClient ocrClient) {
        this.ocrClient = ocrClient;
    }

    public DocumentProcessResponse processar(
            MultipartFile file) throws Exception {

        OCRResponse ocrResponse = ocrClient.sendToOcr(file);

        if (ocrResponse == null
                || ocrResponse.getPages() == null
                || ocrResponse.getPages().isEmpty()) {

            throw new IllegalStateException(
                    "O serviço OCR não retornou páginas."
            );
        }

        List<OCRPage> paginas = ocrResponse.getPages();

        StringBuilder texto = new StringBuilder();

        for (OCRPage pagina : paginas) {
            if (pagina != null && pagina.getText() != null) {
                texto.append(pagina.getText());
                texto.append("\n\n");
            }
        }

        String textoExtraido = texto.toString().trim();

        if (textoExtraido.isBlank()) {
            throw new IllegalStateException(
                    "O OCR não encontrou texto no documento."
            );
        }

        DadosExtraidos dados = new DadosExtraidos(
                null,
                null,
                null,
                null
        );

        return new DocumentProcessResponse(
                file.getOriginalFilename(),
                null,
                "AGUARDANDO",
                textoExtraido,
                dados
        );
    }
}
